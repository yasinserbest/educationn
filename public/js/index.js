import "@babel/polyfill";
import { login, logout } from "./login";
import { updateData, createData, deleteData } from "./adminPanelData";
import { forgotPassword, resetPassword } from "./passwordSettings";
import { contactMail } from "./contactMail";
import { showAlert } from "./alerts";

const loginForm = document.querySelector(".card__form");
const logOutBtn = document.querySelector(".admin__panel--item-logout");
const btnx = document.querySelectorAll(".btn-x");

const commentForm = document.querySelector("#comments");
const announcmentForm = document.querySelector("#announcments");
const contactForm = document.querySelector("#contact");
const mainSliderForm = document.querySelector("#mainSlides");
const galleryForm = document.querySelector("#galleries");
const passwordForm = document.querySelector("#updateMyPassword");
const deletingForm = document.querySelector("#delete");
const forgotPasswordForm = document.querySelector("#forgotForm");
const resetPasswordForm = document.querySelector("#resetForm");

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (commentForm) {
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("subject", document.getElementById("subject").value);
    form.append("review", document.getElementById("review").value);
    const photo = document.getElementById("photo").files[0];
    if (photo === undefined) {
      showAlert("error", "Bir fotoğraf girmelisiniz..");
    } else {
      form.append("photo", photo);
      createData(form, "yorumlar");
    }
  });
}
if (announcmentForm) {
  announcmentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const creator = document.getElementById("creator").value;
    const subject = document.getElementById("subject").value;
    const announcment = document.getElementById("announcment").value;
    //createAnnouncment(creator, subject, announcment);
    createData({ creator, subject, announcment }, "duyurular");
  });
}
if (mainSliderForm) {
  mainSliderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("mainHeader", document.getElementById("main").value);
    form.append("subHeader", document.getElementById("sub").value);
    const photo = document.getElementById("photo").files[0];
    if (photo === undefined) {
      showAlert("error", "Bir fotoğraf girmelisiniz..");
    } else {
      form.append("photo", photo);
      createData(form, "anaSlayt");
    }
  });
}
if (galleryForm) {
  galleryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    const photo = document.getElementById("photo").files[0];
    if (photo === undefined) {
      showAlert("error", "Bir fotoğraf girmelisiniz..");
    } else {
      form.append("photo", photo);
      createData(form, "galeri");
    }
  });
}
if (passwordForm) {
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById("passwordCurrent").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    updateData(passwordCurrent, password, passwordConfirm);
  });
}
if (deletingForm) {
  btnx.forEach((btn) => {
    let id = btn.dataset.id;
    let path = window.location.pathname.slice(7); //returns after /admin. Ex:duyurular,yorumlar
    btn.addEventListener("click", () => {
      deleteData(`${path}`, id);
    });
  });
}
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".contact__form--button").textContent =
      "Bekleyiniz..";
    document.querySelector(".contact__form--button").disabled = true;
    document.querySelector(".contact__form--button").style.color = "#3E8CC3";
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
    contactMail(name, subject, email, message);
  });
}
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", (e) => {
    document.querySelector(".btn-forgotPassword").disabled = true;
    e.preventDefault();
    const email = document.getElementById("email").value;
    forgotPassword(email);
  });
}
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", (e) => {
    const token = window.location.pathname.slice(15);
    e.preventDefault();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    resetPassword(password, passwordConfirm, token);
  });
}
