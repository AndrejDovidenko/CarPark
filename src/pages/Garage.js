// import GarageMVC from "../components/GarageMVC";
import ModalWindowCarMod from "../components/ModalWindowCarMod";
import CarList from "../components/CarList";

class GarageView {
  constructor() {
    this.html = `
    <section class="main-page">
      <h1>Garage</h1>
      <button class="btn main-page__btn ">Добавить авто
      </button>
    ${CarList.render()}
    ${ModalWindowCarMod.render()}
    </section>
    `;
    // this.render();
  }

  render() {
    // this.renderCarList();
    return this.html;
  }

  renderModalWindow() {
    ModalWindowCarMod.view.show();
  }

  renderProfileCar() {
    //вызов мвс из другого модуля
  }

  renderCarList() {}
}

class GarageModel {
  constructor(view) {
    this.view = view;
  }

  openModalWindow() {
    this.view.renderModalWindow();
  }
}

class GarageController {
  constructor(model) {
    this.model = model;
    this.addListeners();
  }

  addListeners() {
    document.querySelector("#root").addEventListener("click", (event) => {
      const buttonAdd = event.target.closest(".main-page__btn");
      if (buttonAdd) {
        this.model.openModalWindow();
      }
    });
  }
}

class GarageMain {
  constructor() {
    this.id = "main";
    this.title = "Главная страница примера SPA";
    this.view = new GarageView();
    this.model = new GarageModel(this.view);
    this.controller = new GarageController(this.model);
  }

  render() {
    return this.view.render();
  }
}

const Garage = new GarageMain();

export default Garage;

// export default GarageMain;
