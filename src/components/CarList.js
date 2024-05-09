import Firebase from "./FirebaseAPI";
import ModalWindowCarMod from "./ModalWindowCarMod";

class CarListView {
  constructor() {
    this.container = null;
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
        document.querySelector("#car-list").innerHTML = html;
      })
      .catch((error) => {
        console.error(error);
        document.querySelector("#car-list").innerHTML =
          "<p>Ошибка при загрузке данных</p>";
      });
    return '<div id="car-list" class="car-list">Loading cars...</div>';
  }

  createCarBlock(data) {
    return `<div class="car-block" id="${data.id}">
    <p>Марка:<span>${data.brand}</span></p>
    <p>Модель:<span>${data.model}</span></p>
    <p>Год:<span>${data.year}</span></p>
    <p>Цвет:<span>${data.color}</span></p>
    <p>Регистрационный номер:<span>${data.carPlate}</span></p>
    <p>Пробег:<span>${data.mileage}</span></p>
    <button class="btn remove">Удалить</button>
    <button class="btn edit">Изменить</button>
  </div>`;
  }

  removeElement(el) {
    el.remove();
  }

  async showModalWindow(id) {
    ModalWindowCarMod.view.showModalWindow(
      await Firebase.getItem(Firebase.pathUserCars, id)
    );
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

  openModalWindow(id) {
    this.view.showModalWindow(id);
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
          console.log("block");
          break;
        case buttonRemove:
          this.model.removeElement(clickBlock);

          break;
        case buttonEdit:
          this.model.openModalWindow(clickBlock.id);
          break;
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
