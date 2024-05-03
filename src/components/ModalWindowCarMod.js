import { OPTIONS } from "../constants/constants";
import { ALL_YEARS } from "../constants/constants";
import CarList from "./CarList";

class ModalWindowView {
  constructor() {
    this.container = null;
    this.selectBrand = null;
    this.selectModel = null;
    this.selectYear = null;

    this.html = ` <div class="modal-window">
    <label>Марка
    <select class="select-brand"></select>
  </label>
  <label>Модель
    <select class="select-model" disabled></select>
  </label>
  <label>Год
    <select class="select-year" disabled></select>
  </label>
  <label>Цвет
    <input type="color" class="input-color"/>
  </label>
  <label>Регистрационный номер
    <input type="text" class="car-plate"/>
  </label>
  <label>Пробег
    <input type="number" class="mileage"/>
  </label>
  <button class="btn button-create" disabled>Создать</button>
    </div>`;
  }

  render() {
    return this.html;
  }

  show() {
    this.container = document.querySelector(".modal-window");
    this.selectBrand = document.querySelector(".select-brand");
    this.selectModel = document.querySelector(".select-model");
    this.selectYear = document.querySelector(".select-year");

    this.createOptions(OPTIONS.brands, this.selectBrand);
    this.createOptions(OPTIONS.models[0], this.selectModel);
    this.createOptions(ALL_YEARS, this.selectYear);

    this.container.classList.add("modal-window_open");
  }

  createOptions(arr, item) {
    arr.forEach((el) => {
      const option = document.createElement("option");
      option.append(el);
      item.append(option);
    });
  }

  setDisabled(state, item) {
    item.disabled = state;
  }

  setSelectedIndex(item, value) {
    item.selectedIndex = value;
  }
}

class ModalWindowModel {
  constructor(view) {
    this.view = view;
  }

  createOptions(index, item) {
    this.view.createOptions(OPTIONS.models[index], item);
  }

  setDisabled(state, item) {
    this.view.setDisabled(state, item);
  }

  setSelectedIndex(item, value) {
    this.view.setSelectedIndex(item, value);
  }
}

class ModalWindowController {
  constructor(model, root) {
    this.model = model;
    this.root = root;

    this.selectBrand = null;
    this.selectModel = null;
    this.selectYear = null;
    this.inputColor = null;
    this.carPlate = null;
    this.mileage = null;
    this.buttonCreate = null;

    this.addListeners();
  }

  addListeners() {
    this.root.addEventListener("input", (event) => this.inputHandler(event));
    this.root.addEventListener("click", (event) => this.clickHandler(event));
  }

  clickHandler(event) {
    const button = event.target.closest(".button-create");
    if (button) {
      const data = {
        brand: this.selectBrand.value,
        model: this.selectModel.value,
        year: this.selectYear.value,
        color: this.inputColor.value,
        carPlate: this.carPlate.value,
        mileage: this.mileage.value,
      };
      console.log(data);
    }
  }

  inputHandler(event) {
    const clickSelectBrand = event.target.closest(".select-brand");
    const clickSelectModel = event.target.closest(".select-model");
    const selectIndex = event.target.selectedIndex;

    this.buttonCreate = document.querySelector(".button-create");

    this.selectBrand = document.querySelector(".select-brand");
    this.selectModel = document.querySelector(".select-model");
    this.selectYear = document.querySelector(".select-year");
    this.inputColor = document.querySelector(".input-color");
    this.carPlate = document.querySelector(".car-plate");
    this.mileage = document.querySelector(".mileage");

    if (clickSelectBrand) {
      this.selectModel.innerHTML = "";
      switch (selectIndex) {
        case 0:
          this.model.createOptions(selectIndex, this.selectModel);
          this.model.setDisabled(true, this.selectModel);
          this.model.setDisabled(true, this.selectYear);
          this.model.setSelectedIndex(this.selectYear, 0);
          break;

        default:
          this.model.createOptions(selectIndex, this.selectModel);
          this.model.setDisabled(false, this.selectModel);
          this.model.setDisabled(true, this.selectYear);
          this.model.setSelectedIndex(this.selectYear, 0);
          break;
      }
    }

    if (clickSelectModel) {
      switch (selectIndex) {
        case 0:
          this.model.setDisabled(true, this.selectYear);
          this.model.setSelectedIndex(this.selectYear, 0);
          break;
        default:
          this.model.setDisabled(false, this.selectYear);
      }
    }

    if (
      this.selectBrand.value &&
      this.selectModel.value &&
      this.selectYear.value &&
      this.inputColor.value &&
      this.carPlate.value &&
      this.mileage.value
    ) {
      this.model.setDisabled(false, this.buttonCreate);
    } else {
      this.model.setDisabled(true, this.buttonCreate);
    }
  }
}

class ModalWindowMain {
  constructor() {
    this.view = new ModalWindowView();
    this.model = new ModalWindowModel(this.view);
    this.controller = new ModalWindowController(
      this.model,
      document.querySelector("#root")
    );
  }

  render() {
    return this.view.render();
  }
}

const ModalWindowCarMod = new ModalWindowMain();

export default ModalWindowCarMod;
