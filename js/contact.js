export class Contact {
  constructor() {
    this.formVerification();
  }

  send() {
    const params = {
      FirstName: document.getElementById("first").value,
      LastName: document.getElementById("last").value,
      Email: document.getElementById("email").value,
      Phone: document.getElementById("phone").value,
      Object: document.getElementById("object").value,
      Message: document.getElementById("message").value,
    };
    const serviceID = "service_sbfcxo2";
    const templateID = "template_uuyeb89";
    console.log(params);
    emailjs
      .send(serviceID, templateID, params)
      .then((res) => {
        console.log(res);
        alert("Votre message a bien été envoyé.");
      })
      .catch((err) => console.log(err));
  }

  regexModel(regex, value, input) {
    if (regex.test(value) === false) {
      input.parentElement.setAttribute("data-error-visible", "true");
      return false;
    } else {
      input.parentElement.removeAttribute("data-error-visible");
      return true;
    }
  }

  formVerification() {
    const allInput = document.querySelectorAll(".text-control");
    console.log(allInput);
    const firstNameInput = document.querySelector(
      ".formData[data-error] input[name=first]"
    );
    const lastNameInput = document.querySelector(
      ".formData[data-error] input[name=last]"
    );
    const phoneInput = document.querySelector(
      ".formData[data-error] input[name=phone]"
    );
    const emailInput = document.querySelector(
      ".formData[data-error] input[name=email]"
    );
    const objectInput = document.querySelector(
      ".formData[data-error] input[name=object]"
    );
    const messageInput = document.querySelector(
      ".formData[data-error] textarea"
    );
    let firstNameCheck = false;
    let lastNameCheck = false;
    let phoneCheck = false;
    let emailCheck = false;
    let objectCheck = false;
    let messageCheck = false;

    //REGEX
    const regexOnlyLetter =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$/u;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regexNumber =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    //EVENTS
    firstNameInput.addEventListener("input", () => {
      firstNameCheck = this.regexModel(
        regexOnlyLetter,
        firstNameInput.value,
        firstNameInput
      );
    });

    lastNameInput.addEventListener("input", () => {
      lastNameCheck = this.regexModel(
        regexOnlyLetter,
        lastNameInput.value,
        lastNameInput
      );
    });

    phoneInput.addEventListener("input", () => {
      phoneCheck = this.regexModel(regexNumber, phoneInput.value, phoneInput);
    });

    emailInput.addEventListener("input", () => {
      emailCheck = this.regexModel(regexEmail, emailInput.value, emailInput);
    });

    objectInput.addEventListener("input", () => {
      if (objectInput.value === "") {
        objectInput.parentElement.setAttribute("data-error-visible", "true");
        objectCheck = false;
      } else {
        objectInput.parentElement.removeAttribute("data-error-visible");
        objectCheck = true;
      }
    });

    messageInput.addEventListener("input", () => {
      if (messageInput.value === "") {
        messageInput.parentElement.setAttribute("data-error-visible", "true");
        messageCheck = false;
      } else {
        messageInput.parentElement.removeAttribute("data-error-visible");
        messageCheck = true;
      }
    });

    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (
        (firstNameCheck,
        lastNameCheck,
        phoneCheck,
        emailCheck,
        objectCheck,
        messageCheck)
      ) {
        this.send();
        // alert("Votre message à bien été envoyé");
        allInput.forEach((input) => {
          input.value = "";
        });
        firstNameCheck = false;
        lastNameCheck = false;
        phoneCheck = false;
        emailCheck = false;
        objectCheck = false;
        messageCheck = false;
      } else {
        alert("Veuillez remplir tout les champs requis");
      }
    });
  }
}
