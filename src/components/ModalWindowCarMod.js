import { OPTIONS } from "../constants/constants";
import { ALL_YEARS } from "../constants/constants";
import CarList from "./CarList";
import Firebase from "./FirebaseAPI";

class ModalWindowView {
  constructor() {
    this.container = null;
    this.selectBrand = null;
    this.selectModel = null;
    this.selectYear = null;
    this.inputColor = null;
    this.carPlate = null;
    this.mileage = null;
    this.buttonSave = null;
  }

  render() {
    return ` <div class="modal-window car-mod">
    <label>Марка
    <select class="car-info-input select-brand"></select>
  </label>
  <label>Модель
    <select class="car-info-input select-model" disabled></select>
  </label>
  <label>Год
    <select class="car-info-input select-year" disabled></select>
  </label>
  <label>Цвет
    <input type="color" class="car-info-input input-color"/>
  </label>
  <label>Регистрационный номер
    <input type="text" class="car-info-input car-plate"/>
  </label>
  <label>Пробег
    <input type="number" class="car-info-input mileage"/>
  </label>
  <button class="btn button-save" disabled>Сохранить</button>
    </div>`;
  }

  showModalWindow(data = null) {
    this.container = document.querySelector(".car-mod");
    this.selectBrand = document.querySelector(".select-brand");
    this.selectModel = document.querySelector(".select-model");
    this.selectYear = document.querySelector(".select-year");
    this.inputColor = document.querySelector(".input-color");
    this.carPlate = document.querySelector(".car-plate");
    this.mileage = document.querySelector(".mileage");
    this.buttonSave = document.querySelector(".button-save");
    this.buttonSave.classList.remove("update");

    this.createOptions(OPTIONS.brands, this.selectBrand);
    this.createOptions(OPTIONS.models[0], this.selectModel);
    this.createOptions(ALL_YEARS, this.selectYear);

    if (data) {
      this.selectModel.innerHTML = "";
      this.createOptions(OPTIONS.models[data.brandIndex], this.selectModel);

      this.setSelectedIndex(this.selectBrand, data.brandIndex);
      this.setSelectedIndex(this.selectModel, data.modelIndex);
      this.setSelectedIndex(this.selectYear, data.yearIndex);
      this.inputColor.value = data.color;
      this.carPlate.value = data.carPlate;
      this.mileage.value = data.mileage;
      this.setDisabled(false, this.selectModel);
      this.setDisabled(false, this.selectYear);
      this.buttonSave.classList.add("update");
      this.buttonSave.setAttribute("data-id", data.id);
    }

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

  // renderCarList() {
  //   CarList.render();
  // }

  renderCarBlock(data) {
    CarList.view.renderCarBlock(data);
  }

  updateCarBlock(data) {
    CarList.view.updateCarBlock(data);
  }

  cleanModalWindow() {
    const arr = this.container.querySelectorAll(".car-info-input");

    arr.forEach((el) => {
      if (el.tagName.toLowerCase() === "select") {
        el.innerHTML = "";
      } else if (el.type === "color") {
        el.value = "#000000";
      } else {
        el.value = "";
      }
    });
  }

  closeModalWindow() {
    this.setDisabled(true, this.buttonSave);
    this.setDisabled(true, this.selectModel);
    this.setDisabled(true, this.selectYear);
    this.container.classList.remove("modal-window_open");
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

  async createCar(data) {
    if (!data.id) {
      data.id = "car1";
    } else {
      const index = Number(data.id[data.id.length - 1]) + 1;
      data.id = "car" + index;
    }

    await Firebase.createItem(data.id, data);
    this.view.renderCarBlock(data);
  }

  async updateCar(data) {
    await Firebase.createItem(data.id, data);
    this.view.updateCarBlock(data);
  }

  cleanModalWindow() {
    this.view.cleanModalWindow();
  }

  closeModalWindow() {
    this.view.closeModalWindow();
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
    this.buttonSave = null;

    this.addListeners();
  }

  addListeners() {
    this.root.addEventListener("input", (event) => this.inputHandler(event));
    this.root.addEventListener("click", (event) => this.clickHandler(event));
  }

  clickHandler(event) {
    const buttonSave = event.target.closest(".button-save");
    const arrCars = document.querySelectorAll(".car-block");
    const lastId = arrCars[arrCars.length - 1]?.getAttribute("id");

    if (buttonSave) {
      const data = {
        brand: this.selectBrand.value,
        brandIndex: this.selectBrand.selectedIndex,
        model: this.selectModel.value,
        modelIndex: this.selectModel.selectedIndex,
        year: this.selectYear.value,
        yearIndex: this.selectYear.selectedIndex,
        color: this.inputColor.value,
        carPlate: this.carPlate.value,
        mileage: this.mileage.value,
        id: lastId,
      };

      if (buttonSave.classList.contains("update")) {
        data.id = buttonSave.getAttribute("data-id");

        this.model.updateCar(data);
      } else {
        this.model.createCar(data);
      }

      this.model.cleanModalWindow();
      this.model.closeModalWindow();
    }
  }

  inputHandler(event) {
    const clickSelectBrand = event.target.closest(".select-brand");
    const clickSelectModel = event.target.closest(".select-model");
    const selectIndex = event.target.selectedIndex;

    this.buttonSave = document.querySelector(".button-save");

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

    if (document.querySelector(".car-mod")) {
      if (
        this.selectBrand.value &&
        this.selectModel.value &&
        this.selectYear.value &&
        this.inputColor.value &&
        this.carPlate.value &&
        this.mileage.value
      ) {
        this.model.setDisabled(false, this.buttonSave);
      } else {
        this.model.setDisabled(true, this.buttonSave);
      }
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
