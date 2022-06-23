import "../scss/style.scss";

console.log("index.js is loading!!");

// import {Form} from "./modules/Form";
export class Form {
  constructor(form) {
    this.form = form;
    this.confirmCheckbox = this.form.querySelector(`[name="agree"]`);
    this.inputElement = this.form.querySelectorAll("input, textarea");
    this.confirmButton = this.form.querySelector(".js-confirm-button");
    this.fixButton = this.form.querySelector(".js-fix-button");
    this.submitButton = this.form.querySelector(".js-submit-button");
  }

  init() {
    const isContactPage = document.URL.match(/contact\//) != null;
    if (isContactPage) {
      this.checkConfirmIsDisabled(this.confirmCheckbox);
    }
  }

  handleEvent() {
    const isContactPage = document.URL.match(/contact\//) != null;
    const isConfirmPage = document.URL.match(/contact-confirm\//) != null;

    if (isContactPage) {
      this.handleSubmitDisabled(this.confirmCheckbox);
      this.handleClickConfirmButton(this.confirmButton);
    }

    if (isConfirmPage) {
      this.setValueOnConfirmPage();
      this.handleBackToContactPage(this.fixButton);
      this.handleSubmitFormData(this.submitButton);
    }
  }

  handleSubmitDisabled(checkbox) {
    checkbox.addEventListener("click", () => {
      this.checkConfirmIsDisabled(this.confirmCheckbox);
    });
  }

  handleClickConfirmButton(confirmButton) {
    confirmButton.addEventListener("click", () => {
      this.confirmButtonEvent(this.form, this.inputElement);
    });
  }

  handleBackToContactPage(fixButton) {
    fixButton.addEventListener("click", () => {
      this.backToContactPage();
    });
  }

  handleSubmitFormData(submitButton) {
    submitButton.addEventListener("click", () => {
      this.submitFormData(this.form);
    });
  }

  checkConfirmIsDisabled(checkbox) {
    if (checkbox.checked) {
      this.confirmButton.setAttribute("aria-disabled", false);
      this.confirmButton.disabled = false;
    } else {
      this.confirmButton.setAttribute("aria-disabled", true);
      this.confirmButton.disabled = true;
    }
  }

  confirmButtonEvent(form, inputElement) {
    this.displayValidation(inputElement);

    const isValid = form.checkValidity();
    if (isValid) {
      this.setFormToStorage(form);
      this.moveConfirmPage();
    }
  }

  setFormToStorage() {
    const formData = new FormData(this.form);
    const arrayFormData = [...formData.entries()].map((data) => {
      const obj = { name: data[0], value: data[1] };
      return obj;
    });
    const convertedFormData = JSON.stringify(arrayFormData);
    sessionStorage.setItem("form", convertedFormData);
  }

  displayValidation(inputElement) {
    inputElement.forEach((targetInput) => {
      const targetName = targetInput.getAttribute("name");
      const invalidMessage = targetInput.getAttribute("title");
      const messageArea = this.form.querySelectorAll(
        `[data-validation="${targetName}"]`
      );
      const hasValidateMessage =
        messageArea !== null && targetInput.hasAttribute("title");

      const isValid = targetInput.validity.valid;

      targetInput.setAttribute("data-is-valid", isValid);

      if (hasValidateMessage) {
        messageArea[0].innerHTML = isValid ? "" : invalidMessage;
      }

      return;
    });
  }

  moveConfirmPage() {
    const url = document.URL.replace(/contact\//, "contact-confirm");
    location.href = url;
  }

  backToContactPage() {
    window.history.back(-1);
    return false;
  }

  setValueOnConfirmPage() {
    if (sessionStorage.getItem("form")) {
      const parsedFormData = JSON.parse(sessionStorage.getItem("form"));

      parsedFormData.forEach((data, index) => {
        const valueArea = this.form.querySelectorAll(".js-input-value");
        const length = valueArea.length;

        if (0 <= index && index < length) {
          valueArea[index].innerHTML = data.value;
        }
      });
    }
  }

  submitFormData() {
    if (sessionStorage.getItem("form")) {
      const parsedFormData = JSON.parse(sessionStorage.getItem("form"));
      const formData = new FormData();
      parsedFormData.map((data) => {
        formData.append(data.name, data.value);
      });

      const url = document.URL.replace(/contact-confirm\//, "contact-thanks");

      fetch("../assets/api/contact.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then(() => {
          sessionStorage.removeItem("form");
          location.href = url;
        })
        .catch((error) => {
          console.error(error);
        });

      // $.ajax({
      //   url: "http://pixel-hearts.lolipop.jp/staging/form-template/assets/api/contact.php",
      //   type: "POST",
      //   processData: false,
      //   contentType: false,
      //   data: formData,
      //   success: function () {
      //     sessionStorage.removeItem("form");
      //     location.href = url;
      //   },
      //   error: function (XMLHttpRequest, textStatus, errorThrown) {
      //     console.log(XMLHttpRequest.status);
      //     console.log(textStatus);
      //     console.log(errorThrown.message);
      //     console.log("error");
      //   },
      // });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const formElement = document.querySelector("#contact-form");
  const hasFormElement = formElement != null;
  if (hasFormElement) {
    const form = new Form(formElement);
    form.init();
    form.handleEvent();
  }
});
