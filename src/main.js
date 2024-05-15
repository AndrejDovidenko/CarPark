import "normalize.css";
import "./scss/style.scss";
import Firebase from "./components/FirebaseAPI.js";
import LoginForm from "./components/LoginForm.js";
import Garage from "./pages/Garage.js";
import About from "./pages/About.js";
import Statistics from "./pages/Statistics.js";
import Navbar from "./components/NavBar.js";
import ContentContainer from "./components/ContentContainer.js";

const components = {
  navbar: Navbar,
  content: ContentContainer,
};

const routes = {
  main: Garage,
  about: About,
  statistics: Statistics,
  default: Garage,
};

class MainView {
  constructor(mainContainer, routes) {
    this.mainContainer = mainContainer;
    this.menu = this.mainContainer.querySelector("#main-menu");
    this.contentContainer = this.mainContainer.querySelector("#content");
    this.routes = routes;
  }

  updateButtons(_currentPage) {
    const menuLinks = this.menu.querySelectorAll(".main-menu__link");

    for (let link of menuLinks) {
      _currentPage === link.getAttribute("href").slice(1)
        ? link.classList.add("active")
        : link.classList.remove("active");
    }
  }

  renderContent(_hashPageName) {
    let routeName = "default";

    if (_hashPageName.length > 0) {
      routeName = _hashPageName in routes ? _hashPageName : "default";
    }

    window.document.title = routes[routeName].title;
    this.contentContainer.innerHTML = routes[routeName].render();
    this.updateButtons(routes[routeName].id);
  }
}

class MainModel {
  constructor(view) {
    this.view = view;
  }

  updateState(_pageName) {
    this.view.renderContent(_pageName);
  }
}

class MainController {
  constructor(mainContainer, model) {
    this.mainContainer = mainContainer;
    this.model = model;
    this.addListeners();
  }

  addListeners() {
    window.addEventListener("hashchange", () => this.updateState());

    this.mainContainer
      .querySelector(".main-menu__list")
      .addEventListener("click", (event) => {
        event.preventDefault();
        window.location.hash = event.target.getAttribute("href");

        this.updateState();
      });

    this.mainContainer.addEventListener("click", (event) => {
      const exit = event.target.closest(".exit");
      if (exit) {
        Firebase.logOut();
      }
    });

    this.updateState(); //первая отрисовка
  }

  updateState() {
    const hashPageName = location.hash.slice(1).toLowerCase();
    this.model.updateState(hashPageName);
  }
}

class Main {
  constructor(mainContainer) {
    this.mainContainer = mainContainer;
  }

  renderLoginForm() {
    this.mainContainer.innerHTML = LoginForm.render();
  }

  openUserProfile() {
    this.mainContainer.innerHTML = "";
    this.renderComponents(components);
    this.view = new MainView(this.mainContainer, routes);
    this.model = new MainModel(this.view);
    this.controller = new MainController(this.mainContainer, this.model);
  }

  renderComponents(components) {
    for (let item in components) {
      if (components.hasOwnProperty(item)) {
        this.mainContainer.innerHTML += components[item].render();
      }
    }
  }
}

const spa = new Main(document.getElementById("root"));
export default spa;
