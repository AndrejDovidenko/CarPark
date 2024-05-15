import Firebase from "./FirebaseAPI";

class LoginView {
  constructor() {
    this.html = `
    <div class="login-form">
    <h1>Приветствую!</h1>
    <p>Залогинтесь пожалуйста</p>
      <label class="login-label">Email:<input type="email" class="email" /></label>
      <label class="login-label">Password:<input type="password" class="password" /></label>
      <div class="buttons-login-form">
        <button class="btn button-sign-in">Войти</button>
        <button class="btn button-sign-up">Создать аккаунт</button>
      </div>
      <p class= info-login-form><p>
      </div>`;
  }

  render() {
    return this.html;
  }

  cleanForm(email, password) {
    email.value = "";
    password.value = "";
  }

  showInfo(text) {
    document.querySelector(".info-login-form").textContent = text;
  }
}

class LoginModel {
  constructor(view) {
    this.view = view;
  }

  cleanForm(email, password) {
    this.view.cleanForm(email, password);
  }
}

class LoginController {
  constructor(model, root) {
    this.model = model;
    this.root = root;
    this.addListeners();
  }

  addListeners() {
    this.root.addEventListener("click", (event) => this.clickHandler(event));
  }

  clickHandler(event) {
    const buttonSignIn = event.target.closest(".button-sign-in");
    const buttonSignUp = event.target.closest(".button-sign-up");

    const email = document.querySelector(".email");
    const password = document.querySelector(".password");

    if (buttonSignIn) {
      Firebase.signInEmailPassword(email.value, password.value);
      this.model.cleanForm(email, password);
    }

    if (buttonSignUp) {
      Firebase.createAccount(email.value, password.value);
      this.model.cleanForm(email, password);
    }
  }
}

class LoginMain {
  constructor() {
    this.view = new LoginView();
    this.model = new LoginModel(this.view);
    this.controller = new LoginController(
      this.model,
      document.querySelector("#root")
    );
  }

  render() {
    return this.view.render();
  }

  showInfo(text) {
    this.view.showInfo(text);
  }
}

const LoginForm = new LoginMain();

export default LoginForm;
