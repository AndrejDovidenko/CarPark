import carImgSvg from "../img/car.svg";
import { generateSvg } from "../constants/generateSVG";
import ModalWindowNoteMod from "./ModalWindowNoteMod";
import Firebase from "./FirebaseAPI";
import NoteList from "./NoteList";

class CarProfileView {
  constructor() {
    this.carSvg = generateSvg(carImgSvg).querySelector("svg");
    this.container = null;
    this.partsList = null;
  }

  render(data) {
    this.carSvg.style.fill = data.color;

    return `<section class="profile" id="${data.id}">
    <div class="car-info">
    <div><h1>${data.brand} ${data.model}</h1>
    <p>Год:<span>${data.year}</span></p>
    <p>Цвет:<span>${data.color}</span></p>
    <p>Регистрационный номер:<span>${data.carPlate}</span></p>
    <p>Пробег:<span>${data.mileage}</span></p>
    </div>
    <div class="car-img"> ${this.carSvg.outerHTML}</div>
    </div>
    <div class="profile-control-panel">
    <button class = "btn history">История</button>
    <button class = "btn installed-parts">Установленные запчасти</button>
    <button class = "btn add-note ">Добавить запись</button>
    </div>
   
    ${NoteList.render(data.id)}
    ${ModalWindowNoteMod.render()}
    </section>`;
  }

  createPartsListItem(data) {
    return `<li class= "list-item" id=${data.id}><span>${data.name} </span><span>${data.number} </span><span>${data.brand} </span><span>${data.cost} руб.</span></li>`;
  }

  openModalWindow() {
    ModalWindowNoteMod.view.showModalWindow();
  }

  renderNoteList(profileId) {
    this.partsList.remove();
    const list = `<div class="note-list" id ="note-list"></div>`;
    this.container.insertAdjacentHTML("beforeend", list);
    NoteList.render(profileId);
  }

  renderParts(snapshot) {
    this.container = document.querySelector(".profile");
    this.partsList = document.createElement("ol");
    const noteList = document.querySelector(".note-list");
    noteList.remove();

    snapshot.forEach((el) => {
      this.partsList.innerHTML += this.createPartsListItem(el.data());
    });

    this.container.append(this.partsList);
  }
}

class CarProfileModel {
  constructor(view) {
    this.view = view;
  }

  openModalWindow() {
    this.view.openModalWindow();
  }

  async showParts(profileId) {
    const snapshot = await Firebase.getItemsArr(
      `${Firebase.pathUserCars}/${profileId}/parts`
    );

    this.view.renderParts(snapshot);
  }

  renderNoteList(profileId) {
    this.view.renderNoteList(profileId);
  }
}

class CarProfileController {
  constructor(model, root) {
    this.root = root;
    this.model = model;
    this.profileId = null;
    this.addListeners();
  }

  addListeners() {
    this.root.addEventListener("click", (event) => this.clickHandler(event));
  }

  clickHandler(event) {
    this.profileId = document.querySelector(".profile")?.id;
    const clickBlock = event.target.closest(".profile-control-panel");
    const addNote = event.target.closest(".add-note");
    const installedParts = event.target.closest(".installed-parts");
    const history = event.target.closest(".history");
    const clickButton = history || installedParts || addNote;

    if (clickBlock) {
      switch (clickButton) {
        case history:
          // console.log("history");
          this.model.renderNoteList(this.profileId);
          break;
        case installedParts:
          this.model.showParts(this.profileId);
          break;
        case addNote:
          this.model.openModalWindow();
          break;
      }
    }
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
