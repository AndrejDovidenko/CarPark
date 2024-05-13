import CarProfile from "./CarProfile";

class NoteModView {
  constructor(date) {
    this.date = date;
    this.container = null;
  }
  render() {
    return ` <div class="modal-window note-mod">
    <div class="info-block">
    <h2 class="date">${this.date}</h2>
    <label> Выполненые работы:
    <input type="textarea" class="info-work-input description"/>
  </label>
  <label>Стоимость работ:
  <input type="number" class="info-work-input cost-work"/>
  </label>
  <label>Пробег:
  <input type="number" class="info-work-input mileage"/>
  </label>
  </div>
  <div class="info-block info-parts">
  <label> Номер запчасти:
    <input type="text" class="info-parts-input parts-number"/>
  </label>
  <label>Название запчасти:
    <input type="text" class="info-parts-input parts-name"/>
  </label>
  <label> Стоимость:
    <input type="number" class="info-parts-input cost-parts "/>
  </label>
  <label> Производитель:
    <input type="text" class="info-parts-input parts-brand"/>
  </label> 
  <button class="btn add-parts" disabled>Добавить</button>
  </div>
  <ol class ="parts-list"></ol>
  <button class="btn button-save-note" disabled>Сохранить</button>
    </div>`;
  }

  showModalWindow() {
    this.container = document.querySelector(".note-mod");

    this.container.classList.add("modal-window_open");
  }

  setDisabled(state, item) {
    item.disabled = state;
  }

  createPartsListItem(data) {
    return `<li class= "list-item"><span>${data.name} </span><span>${data.number} </span><span>${data.brand} </span><span>${data.cost} руб.</span>
    <button class="btn button-remove">Удалить</button></li>
    `;
  }

  cleanInfoParts() {
    const arr = document.querySelectorAll(".info-parts-input");
    arr.forEach((el) => {
      el.value = "";
    });
  }

  renderPartsListItem(data) {
    const list = this.container.querySelector(".parts-list");
    const item = this.createPartsListItem(data);
    // console.log(item);

    list.insertAdjacentHTML("beforeend", item);

    this.cleanInfoParts();
  }

  removeItem(item) {
    item.remove();
  }

  renderNoteBlock(data) {
    CarProfile.view.renderNoteBlock(data);
  }

  closeModalWindow() {
    this.container.classList.remove("modal-window_open");
  }

  cleanModalWindow() {
    const arr = this.container.querySelectorAll(".info-work-input");
    const list = this.container.querySelector(".parts-list");

    list.innerHTML = "";
    arr.forEach((el) => {
      el.value = "";
    });
  }
}

class NoteModModel {
  constructor(view) {
    this.view = view;
  }

  setDisabled(state, item) {
    this.view.setDisabled(state, item);
  }

  createPartsListItem(data) {
    this.view.renderPartsListItem(data);
  }

  removeItem(item) {
    this.view.removeItem(item);
  }

  createNote(data) {
    this.view.renderNoteBlock(data);
  }

  closeModalWindow() {
    this.view.closeModalWindow();
  }

  cleanModalWindow() {
    this.view.cleanModalWindow();
  }
}

class NoteModController {
  constructor(model, root) {
    this.model = model;
    this.root = root;

    this.partsNumber = null;
    this.partsName = null;
    this.costParts = null;
    this.partsBrand = null;
    this.buttonAdd = null;

    this.description = null;
    this.costWork = null;
    this.mileage = null;
    this.buttonSave = null;

    this.container = null;

    this.addListeners();
  }

  addListeners() {
    this.root.addEventListener("click", (event) => this.clickHandler(event));
    this.root.addEventListener("input", (event) => this.inputHandler(event));
  }

  inputHandler(event) {
    this.description = document.querySelector(".description");
    this.costWork = document.querySelector(".cost-work");
    this.mileage = document.querySelector(".mileage");
    this.buttonSave = document.querySelector(".button-save-note");

    this.buttonAdd = document.querySelector(".add-parts");
    this.partsNumber = document.querySelector(".parts-number");
    this.partsName = document.querySelector(".parts-name");
    this.costParts = document.querySelector(".cost-parts");
    this.partsBrand = document.querySelector(".parts-brand");

    if (document.querySelector(".note-mod")) {
      if (
        this.partsNumber.value &&
        this.partsName.value &&
        this.costParts.value &&
        this.partsBrand.value
      ) {
        this.model.setDisabled(false, this.buttonAdd);
      } else {
        this.model.setDisabled(true, this.buttonAdd);
      }

      if (this.description.value && this.costWork.value && this.mileage.value) {
        this.model.setDisabled(false, this.buttonSave);
      } else {
        this.model.setDisabled(true, this.buttonSave);
      }
    }
  }

  clickHandler(event) {
    const buttonAdd = event.target.closest(".add-parts");
    const buttonRemove = event.target.closest(".button-remove");
    const buttonSave = event.target.closest(".button-save-note");

    if (buttonAdd) {
      const data = {
        number: this.partsNumber.value,
        name: this.partsName.value,
        cost: this.costParts.value,
        brand: this.partsBrand.value,
      };

      this.model.createPartsListItem(data);
    }

    if (buttonRemove) {
      const item = event.target.closest(".list-item");

      this.model.removeItem(item);
    }

    if (buttonSave) {
      this.container = document.querySelector(".modal-window");
      const partsList = this.container.querySelector(".parts-list");
      partsList.querySelectorAll(".button-remove").forEach((el) => el.remove());
      //   console.log(this.partsList);

      const data = {
        description: this.description.value,
        cost: this.costWork.value,
        mileage: this.mileage.value,
        list: partsList.outerHTML,
      };

      this.model.createNote(data);
      this.model.closeModalWindow();
      this.model.cleanModalWindow();
      this.model.setDisabled(true, buttonSave);
    }
  }
}

class NoteModMain {
  constructor() {
    this.view = new NoteModView(new Date());
    this.model = new NoteModModel(this.view);
    this.controller = new NoteModController(
      this.model,
      document.querySelector("#root")
    );
  }

  render() {
    return this.view.render();
  }
}

const ModalWindowNoteMod = new NoteModMain();
export default ModalWindowNoteMod;
