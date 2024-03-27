export class SkillsManager {
  constructor(skills, projects) {
    this.skills = skills;
    this.projects = projects;
  }

  displaySkills() {
    const gridDOMElements = [];

    this.skills.forEach((skill) => {
      const pic = `assets/img/${skill.picture}`;
      gridDOMElements.push(`
        <div class="${skill.name}__skill skill flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front flip__border">
              <img src=${pic} alt="logo ${skill.name}" class="${skill.name}__logo logo__skills" />
            </div>
            <div class="flip-card-back flip__border">
              <p class="${skill.name}__txt txt__skills">${skill.name}</p>
            </div>
          </div>
        </div>
        `);
    });
    return gridDOMElements.join("");
  }

  // displayProjects() {
  //   const gridDOMElements = [];

  //   this.projects.forEach((project) => {
  //     const pic = `assets/img/${project.picture}`;
  //     gridDOMElements.push(`
  //       <div class="item">
  //           <div class="item__image">
  //               <img src="${pic}" alt="">
  //           </div>
  //           <div class="item__body">
  //               <div class="item__title">${project.title}</div>
  //               <div class="item__description">${project.description}</div>
  //           </div>
  //       </div>
  //     `);
  //   });

  //   return gridDOMElements.join("");
  // }
}
