import ModalWindowCarMod from "../components/ModalWindowCarMod";
import CarList from "../components/CarList";
import CarProfile from "../components/CarProfile";

class GarageView {
  // constructor() {}

  render() {
    return `
    <section class="main-page">
      <h1>Garage</h1>
      <button class="btn main-page__btn ">Добавить авто
      </button>
    ${CarList.render()}
    ${ModalWindowCarMod.render()}
    </section>
    `;
  }

  renderModalWindow() {
    ModalWindowCarMod.view.showModalWindow();
  }

  renderCarProfile(data) {
    const container = document.querySelector(".main-page");
    container.innerHTML = CarProfile.render(data);
  }
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
