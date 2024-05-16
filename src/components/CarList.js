import Firebase from "./FirebaseAPI";
import ModalWindowCarMod from "./ModalWindowCarMod";
import Garage from "../pages/Garage";
import { click, modal, open } from "../constants/constants";

class CarListView {
  constructor() {
    this.container = null;
    this.amountCars = null;
  }

  async renderCars() {
    const arr = await Firebase.getItemsArr(Firebase.pathUserCars);
    let html = ``;

    arr.forEach((el) => {
      html += this.createCarBlock(el.data());
    });

    return html;
  }

  render() {
    this.renderCars()
      .then((html) => {
        this.container = document.querySelector("#car-list");
        this.container.innerHTML = html;
        this.renderCountCars();
      })
      .catch((error) => {
        console.error(error);
        this.container.innerHTML = "<p>Ошибка при загрузке данных</p>";
      });

    return '<div id="car-list" class="car-list"><span class="loader"></span></div>';
  }

  createCarBlock(data) {
    return `<div class="car-block" id="${data.id}">
    <div class="info-car-list">
    <p>Марка:<span>${data.brand}</span></p>
    <p>Модель:<span>${data.model}</span></p>
    <p>Год:<span>${data.year}</span></p>
    <p class="color">Цвет:<span style ="background-color:${data.color}"></span></p>
    <p>Регистрационный номер:<span>${data.carPlate}</span></p>
    <p>Пробег:<span>${data.mileage}</span></p>
    </div>
    <div class="control">
    <button class="btn remove">Удалить</button>
    <button class="btn edit">Изменить</button>
    </div>
  </div>`;
  }

  renderCountCars() {
    this.amountCars = this.container.querySelectorAll(".car-block").length;
    const item = document.querySelector(".count-cars");
    item.textContent = ` (${this.amountCars})`;
  }

  renderCarBlock(data) {
    const block = this.createCarBlock(data);
    this.container.insertAdjacentHTML("beforeend", block);
    this.renderCountCars();
  }

  updateCarBlock(data) {
    const block = this.container.querySelector(`#${data.id}`);
    const newBlock = new DOMParser()
      .parseFromString(this.createCarBlock(data), "text/html")
      .querySelector(".car-block");
    block.replaceWith(newBlock);
  }

  removeElement(el) {
    el.remove();
  }

  openModalWindow(data) {
    ModalWindowCarMod.view.showModalWindow(data);
  }

  openCarProfile(data) {
    Garage.view.renderCarProfile(data);
  }
}

class CarListModel {
  constructor(view) {
    this.view = view;
  }

  removeElement(el) {
    this.view.removeElement(el);
    Firebase.deleteItem(el.id);
  }

  async openModalWindow(id) {
    const data = await Firebase.getItem(Firebase.pathUserCars, id);
    this.view.openModalWindow(data);
  }

  async openCarProfile(id) {
    const data = await Firebase.getItem(Firebase.pathUserCars, id);

    this.view.openCarProfile(data);
  }

  renderCountCars() {
    this.view.renderCountCars();
  }
}

class CarListController {
  constructor(model, root) {
    this.model = model;
    this.root = root;
    this.addListeners();
  }

  addListeners() {
    this.root.addEventListener("click", (event) => this.clickHandler(event));
  }

  clickHandler(event) {
    const clickBlock = event.target.closest(".car-block");
    const buttonRemove = event.target.closest(".remove");
    const buttonEdit = event.target.closest(".edit");
    const clickButton = buttonRemove || buttonEdit || null;

    if (clickBlock) {
      switch (clickButton) {
        case null:
          this.model.openCarProfile(clickBlock.id);
          if (!document.querySelector(".soundOff")) {
            open.play();
          }
          break;
        case buttonRemove:
          this.model.removeElement(clickBlock);
          this.model.renderCountCars();
          if (!document.querySelector(".soundOff")) {
            click.play();
          }
          break;
        case buttonEdit:
          this.model.openModalWindow(clickBlock.id);
          if (!document.querySelector(".soundOff")) {
            modal.play();
          }
          break;
        default:
      }
    }
  }
}

class CarListMain {
  constructor() {
    this.view = new CarListView();
    this.model = new CarListModel(this.view);
    this.controller = new CarListController(
      this.model,
      document.querySelector("#root")
    );
  }

  render() {
    return this.view.render();
  }
}

const CarList = new CarListMain();

export default CarList;

// async a() {
//   const snapshot = await Firebase.getItemsArr(Firebase.pathUserCars);
//   let arr = [];
//   snapshot.forEach((el) => arr.push(el.data().id));

//   for (let i = 0; arr.length > i; i++) {
//     const snap = await Firebase.getItemsArr(
//       `${Firebase.pathUserCars}/${arr[i]}/parts`
//     );

//     console.log(snap.docs);
//   }
// }
