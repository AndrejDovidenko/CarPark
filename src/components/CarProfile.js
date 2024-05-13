import carImgSvg from "../img/car.svg";
import { generateSvg } from "../constants/generateSVG";
import ModalWindowNoteMod from "./ModalWindowNoteMod";

class CarProfileView {
  constructor() {
    this.carSvg = generateSvg(carImgSvg).querySelector("svg");
  }

  render(data) {
    // const svg = new DocumentFragment();
    // const div = document.createElement("div");
    // div.innerHTML = carImgSvg;
    // svg.append(div);

    // console.log(svg);
    this.carSvg.style.fill = data.color;

    // console.log(generateSvg(carImgSvg));
    return `<section class="profile">
    <div class="car-info" id="${data.id}">
    <div><h1>${data.brand} ${data.model}</h1>
    <p>Год:<span>${data.year}</span></p>
    <p>Цвет:<span>${data.color}</span></p>
    <p>Регистрационный номер:<span>${data.carPlate}</span></p>
    <p>Пробег:<span>${data.mileage}</span></p>
    </div>
    <div class="car-img"> ${this.carSvg.outerHTML}</div>
    </div>
    <div class="profile-control-panel">
    <button class = "btn ">История</button>
    <button class = "btn ">Установленные запчасти</button>
    <button class = "btn add-note ">Добавить запись</button>
    </div>
    <div class="note-list"></div>
    ${ModalWindowNoteMod.render()}
    </section>`;
  }

  openModalWindow() {
    // console.log(444);
    ModalWindowNoteMod.view.showModalWindow();
  }

  createNoteBlock(data) {
    return `<div class="note-block">
 <p>${data.description}</p>
 <p>Стоимость: ${data.cost}</p>
 <p>Пробег: ${data.mileage}</p>
 ${data.list} 
 <button class="btn remove-note">Удалить</button>
 <button class="btn edit-note">Изменить</button>
  </div>`;
  }

  renderNoteBlock(data) {
    const container = document.querySelector(".note-list");
    const block = this.createNoteBlock(data);
    container.insertAdjacentHTML("beforeend", block);
    // console.log(block);
  }

  removeItem(item) {
    item.remove();
  }
}

class CarProfileModel {
  constructor(view) {
    this.view = view;
  }

  openModalWindow() {
    this.view.openModalWindow();
  }

  removeItem(item) {
    this.view.removeItem(item);
  }
}

class CarProfileController {
  constructor(model, root) {
    this.root = root;
    this.model = model;
    this.addListeners();
  }

  addListeners() {
    this.root.addEventListener("click", (event) => {
      const buttonAdd = event.target.closest(".add-note");
      const removeNote = event.target.closest(".remove-note");
      if (buttonAdd) {
        // console.log(222);
        this.model.openModalWindow();
      }

      if (removeNote) {
        const item = event.target.closest(".note-block");
        this.model.removeItem(item);
      }
    });
  }
}

class CarProfileMain {
  constructor() {
    this.view = new CarProfileView();
    this.model = new CarProfileModel(this.view);
    this.controller = new CarProfileController(
      this.model,
      document.querySelector("#root")
    );
  }

  render(data) {
    return this.view.render(data);
  }
}

const CarProfile = new CarProfileMain();

export default CarProfile;
