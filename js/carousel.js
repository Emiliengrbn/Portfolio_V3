export class CarouselDOM {
  constructor(projects) {
    this.projects = projects;
  }

  displayProjects() {
    const gridDOMElements = [];

    this.projects.forEach((project) => {
      const pic = `assets/img/${project.picture}`;

      gridDOMElements.push(`
            <div class="item">
              <div class="item__image">
                <a href=${project.link} target="_blank" class="item__image">
                  <img src="${pic}" alt="">
                </a>
              </div>
                <div class="item__body">
                    <div class="item__title">${project.title}</div>
                    <div class="item__description">${project.description}</div>
                </div>
            </div>
          `);
    });

    return gridDOMElements.join("");
  }
}

/**
 * Permet de rajouter la navigation tactile pour le carousel
 */
class CarouselTouchPlugin {
  /**
   *
   * @param {Carousel} carousel
   */
  constructor(carousel) {
    carousel.container.addEventListener("dragstart", (e) => e.preventDefault());
    carousel.container.addEventListener("mousedown", this.startDrag.bind(this));
    carousel.container.addEventListener(
      "touchstart",
      this.startDrag.bind(this)
    );
    window.addEventListener("mousemove", this.drag.bind(this));
    window.addEventListener("touchmove", this.drag.bind(this), {
      passive: false,
    });
    window.addEventListener("touchend", this.endDrag.bind(this));
    window.addEventListener("mouseup", this.endDrag.bind(this));
    window.addEventListener("touchcancel", this.endDrag.bind(this));
    this.carousel = carousel;
  }

  /**
   * Démarre le déplacement au touché
   * @param {MouseEvent|TouchEvent} e
   */
  startDrag(e) {
    if (e.touches) {
      if (e.touches.length > 1) {
        return;
      } else {
        e = e.touches[0];
      }
    }
    this.origin = { x: e.screenX, y: e.screenY };
    this.width = this.carousel.containerWidth;
    this.carousel.disableTransition();
  }

  /**
   * Déplacement
   * @param {MouseEvent|TouchEvent} e
   */
  drag(e) {
    if (this.origin) {
      const point = e.touches ? e.touches[0] : e;
      const translate = {
        x: point.screenX - this.origin.x,
        y: point.screenY - this.origin.y,
      };
      const baseTranslate =
        (this.carousel.currentItem * -100) / this.carousel.items.length;
      this.lastTranslate = translate;
      this.carousel.translate(baseTranslate + (100 * translate.x) / this.width);
    }
  }

  /**
   * fin du déplacement
   * @param {MouseEvent|TouchEvent} e
   */
  endDrag(e) {
    if (this.origin && this.lastTranslate) {
      this.carousel.enableTransition();
      if (Math.abs(this.lastTranslate.x / this.carousel.carouselWidth) > 0.2) {
        if (this.lastTranslate.x < 0) {
          this.carousel.next();
        } else {
          this.carousel.prev();
        }
      } else {
        this.carousel.goToItem(this.carousel.currentItem);
      }
    }
    this.origin = null;
  }
}

export class Carousel {
  /**
   *
   * @param {HTMLElement} element
   * @param {Object} options
   * @param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
   * @param {Object} [options.slidesVisible=1] Nombre d'éléments visible dans la slide
   * @param {Boolean} [options.loop=false] Doit-on boucler en fin de carousel
   * @param {Boolean} [options.infinite=false]
   * @param {Boolean} [options.pagination=false]
   * @param {Boolean} [options.navigation=true]
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign(
      {},
      {
        slidesToScroll: 1,
        slidesVisible: 1,
        loop: false,
        pagination: false,
        navigation: true,
        infinite: false,
      },
      options
    );
    if (this.options.loop && this.options.infinite) {
      throw new Error(
        "Un carousel ne peut être à la fois en boule et en infini"
      );
    }
    console.log(element.children);
    const children = [].slice.call(element.children);
    console.log(children);
    this.isMobile = false;
    this.currentItem = 0;
    this.moveCallBacks = [];
    this.offset = 0;

    // Modification du DOM
    this.root = this.createDivWithClass("carousel");
    this.container = this.createDivWithClass("carousel__container");
    this.root.setAttribute("tabindex", "0");
    this.root.appendChild(this.container);
    this.element.appendChild(this.root);
    this.items = children.map((child) => {
      const item = this.createDivWithClass("carousel__item");
      item.appendChild(child);
      return item;
    });
    if (this.options.infinite) {
      this.offset = this.options.slidesVisible + this.options.slidesToScroll;
      if (this.offset > children.length) {
        console.log(this.offset);
        console.log(children.length);
        console.error(
          "Vous n'avez pas assez d'éléments dans le carousel",
          element
        );
      }
      this.items = [
        ...this.items
          .slice(this.items.length - this.offset)
          .map((item) => item.cloneNode(true)),
        ...this.items,
        ...this.items.slice(0, this.offset).map((item) => item.cloneNode(true)),
      ];
      this.goToItem(this.offset, false);
    }
    this.items.forEach((item) => this.container.appendChild(item));
    this.setStyle();
    if (this.options.navigation) {
      this.createNavigation();
    }
    if (this.options.pagination) {
      this.createPagination();
    }

    // Evenements
    this.moveCallBacks.forEach((cb) => cb(this.currentItem));
    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize.bind(this));
    this.root.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight") {
        this.next();
      } else if (e.key === "ArrowLeft") {
        this.prev();
      }
    });
    if (this.options.infinite) {
      this.container.addEventListener(
        "transitionend",
        this.resetInfinite.bind(this)
      );
    }
    new CarouselTouchPlugin(this);
  }

  /**
   * Applique les bonnes dimensions aux éléments du carousel
   */
  setStyle() {
    const ratio = this.items.length / this.slidesVisible;
    this.container.style.width = ratio * 100 + "%";
    this.items.forEach(
      (item) => (item.style.width = 100 / this.slidesVisible / ratio + "%")
    );
  }

  createNavigation() {
    const nextButton = this.createDivWithClass("carousel__next");
    const prevButton = this.createDivWithClass("carousel__prev");
    this.root.appendChild(nextButton);
    this.root.appendChild(prevButton);
    nextButton.addEventListener("click", this.next.bind(this));
    prevButton.addEventListener("click", this.prev.bind(this));
    if (this.options.loop === true) {
      return;
    }
    this.onMove((index) => {
      if (index === 0) {
        prevButton.classList.add("carousel__prev--hidden");
      } else {
        prevButton.classList.remove("carousel__prev--hidden");
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add("carousel__next--hidden");
      } else {
        nextButton.classList.remove("carousel__next--hidden");
      }
    });
  }

  createPagination() {
    const pagination = this.createDivWithClass("carousel__pagination");
    const buttons = [];
    this.root.appendChild(pagination);
    for (
      let i = 0;
      i < this.items.length - 2 * this.offset;
      i = i + this.options.slidesToScroll
    ) {
      const button = this.createDivWithClass("carousel__pagination__button");
      button.addEventListener("click", () => this.goToItem(i + this.offset));
      pagination.appendChild(button);
      buttons.push(button);
    }
    this.onMove((index) => {
      const count = this.items.length - 2 * this.offset;
      const activeButton =
        buttons[
          Math.floor(
            ((index - this.offset) % count) / this.options.slidesToScroll
          )
        ];
      if (activeButton) {
        buttons.forEach((button) =>
          button.classList.remove("carousel__pagination__button--active")
        );
        activeButton.classList.add("carousel__pagination__button--active");
      }
    });
  }

  translate(percent) {
    this.container.style.transform = "translate3d(" + percent + "%, 0, 0)";
  }

  next() {
    this.goToItem(this.currentItem + this.slidesToScroll);
  }

  prev() {
    this.goToItem(this.currentItem - this.slidesToScroll);
  }

  /**
   * Déplace le carousel vers l'élément ciblé
   * @param {number} index
   * @param {boolean} [animation = true]
   */
  goToItem(index, animation = true) {
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.options.slidesVisible;
      } else {
        return;
      }
    } else if (
      index >= this.items.length ||
      (this.items[this.currentItem + this.slidesVisible] === undefined &&
        index > this.currentItem)
    ) {
      if (this.options.loop) {
        index = 0;
      } else {
        return;
      }
    }

    const translateX = (index * -100) / this.items.length;

    if (animation === false) {
      this.disableTransition();
    }

    this.translate(translateX);
    this.container.offsetHeight; // force repaint

    if (animation === false) {
      this.enableTransition();
    }

    this.currentItem = index;
    this.moveCallBacks.forEach((cb) => cb(index));
  }

  /**
   * Déplacer le container pour donner l'impression d'un slide infini
   */
  resetInfinite() {
    if (this.currentItem <= this.options.slidesToScroll) {
      this.goToItem(
        this.currentItem + this.items.length - 2 * this.offset,
        false
      );
    } else if (this.currentItem >= this.items.length - this.offset)
      this.goToItem(
        this.currentItem - (this.items.length - 2 * this.offset),
        false
      );
  }

  onMove(cb) {
    this.moveCallBacks.push(cb);
  }

  onWindowResize() {
    const mobile = window.innerWidth < 800;
    if (mobile !== this.isMobile) {
      this.isMobile = mobile;
      this.setStyle();
      this.moveCallBacks.forEach((cb) => cb(this.currentItem));
    }
  }

  /**
   *
   * @param {string} className
   * @return {HTMLElement}
   */
  createDivWithClass(className) {
    const div = document.createElement("div");
    div.setAttribute("class", className);
    return div;
  }

  disableTransition() {
    this.container.style.transition = "none";
  }

  enableTransition() {
    this.container.style.transition = "";
  }

  /**
   * @returns {number}
   */
  get slidesToScroll() {
    return this.isMobile ? 1 : this.options.slidesToScroll;
  }

  /**
   * @returns {number}
   */
  get slidesVisible() {
    return this.isMobile ? 1 : this.options.slidesVisible;
  }

  /**
   * @returns {number}
   */
  get containerWidth() {
    return this.container.offsetWidth;
  }

  /**
   * @returns {number}
   */
  get carouselWidth() {
    return this.root.offsetWidth;
  }
}
