import "normalize.css";
import "./scss/style.scss";
import Garage from "./pages/Garage.js";
import About from "./pages/About.js";
import Statistics from "./pages/Statistics.js";
import ErrorPage from "./pages/ErrorPage.js";
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
  error: ErrorPage,
};

/* ----- spa init module --- */
const mySPA = (function () {
  /* ------- begin view -------- */
  class ModuleView {
    constructor(myModuleContainer, routes) {
      this.myModuleContainer = myModuleContainer;
      this.menu = this.myModuleContainer.querySelector("#mainmenu");
      this.contentContainer = this.myModuleContainer.querySelector("#content");
      this.routes = routes;
    }

    updateButtons(_currentPage) {
      const menuLinks = this.menu.querySelectorAll(".mainmenu__link");

      for (let link of menuLinks) {
        _currentPage === link.getAttribute("href").slice(1)
          ? link.classList.add("active")
          : link.classList.remove("active");
      }
    }

    renderContent(_hashPageName) {
      let routeName = "default";

      if (_hashPageName.length > 0) {
        routeName = _hashPageName in routes ? _hashPageName : "error";
      }

      window.document.title = routes[routeName].title;
      this.contentContainer.innerHTML = routes[routeName].render(
        `${routeName}-page`
      );
      this.updateButtons(routes[routeName].id);
    }
  }

  class ModuleModel {
    constructor(myModuleView) {
      this.myModuleView = myModuleView;
    }

    updateState(_pageName) {
      this.myModuleView.renderContent(_pageName);
    }
  }

  /* -------- end model -------- */
  /* ----- begin controller ---- */

  class ModuleController {
    constructor(myModuleContainer, myModuleModel) {
      this.myModuleContainer = myModuleContainer;
      this.myModuleModel = myModuleModel;
      this.addListeners();
    }

    addListeners() {
      // вешаем слушателей на событие hashchange и кликам по пунктам меню
      window.addEventListener("hashchange", () => this.updateState);

      this.myModuleContainer
        .querySelector("#mainmenu")
        .addEventListener("click", (event) => {
          event.preventDefault();
          window.location.hash = event.target.getAttribute("href");
          this.updateState();
        });

      this.updateState(); //первая отрисовка
    }

    updateState() {
      const hashPageName = location.hash.slice(1).toLowerCase();
      this.myModuleModel.updateState(hashPageName);
    }
  }

  return {
    init: function (root, routes, components) {
      this.renderComponents(root, components);

      const view = new ModuleView(document.getElementById(root), routes);
      const model = new ModuleModel(view);
      const controller = new ModuleController(
        document.getElementById(root),
        model
      );
    },

    renderComponents: function (root, components) {
      const container = document.getElementById(root);
      for (let item in components) {
        if (components.hasOwnProperty(item)) {
          container.innerHTML += components[item].render();
        }
      }
    },
  };
})();
/* ------ end app module ----- */

/*** --- init module --- ***/
mySPA.init("spa", routes, components);
