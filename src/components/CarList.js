class CarListView {
  constructor() {
    this.container = null;
  }

  render() {
    return `<div class="car-list">
    </div>`;
  }

  createCarBlok(data) {
    this.container = document.querySelector(".car-list");
    const block = `<div class="car-block">
    <p>Марка:<span>${data.brand}</span></p>
    <p>Модель:<span>${data.model}</span></p>
    <p>Регистрационный номер:<span>${data.carPlate}</span></p>
    <button class="btn remove">Удалить</button>
    <button class="btn edit">Изменить</button>
  </div>`;

    this.container.insertAdjacentHTML("beforeend", block);
  }

  removeElement(el) {
    el.remove();
  }
}

class CarListModel {
  constructor(view) {
    this.view = view;
  }

  removeElement(el) {
    this.view.removeElement(el);
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
          console.log("remove");
          this.model.removeElement(clickBlock);
          break;
        case buttonEdit:
          console.log("edit");
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
