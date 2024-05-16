import ModalWindowCarMod from "../components/ModalWindowCarMod";
import CarList from "../components/CarList";
import CarProfile from "../components/CarProfile";
import { sound, modal } from "../constants/constants";

class GarageView {
  // constructor() {}

  render() {
    return `
    <section class="main-page">
      <h1>Мой гараж<span class="count-cars"></span></h1>
      <button class="btn add-auto">Добавить авто
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
      const buttonAdd = event.target.closest(".add-auto");
      if (buttonAdd) {
        if (!document.querySelector(".soundOff")) {
          modal.play();
        }
        this.model.openModalWindow();
      }
    });
  }
}

class GarageMain {
  constructor() {
    this.id = "main";
    this.title = "Главная страница";
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
