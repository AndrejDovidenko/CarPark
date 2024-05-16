import carImgSvg from "../img/car.svg";
import { generateSvg } from "../constants/generateSVG";
import ModalWindowNoteMod from "./ModalWindowNoteMod";
import Firebase from "./FirebaseAPI";
import NoteList from "./NoteList";
import { click, modal } from "../constants/constants";

class CarProfileView {
  constructor() {
    this.carSvg = generateSvg(carImgSvg).querySelector("svg");
    this.container = null;
    this.partsList = null;
    this.loader = null;
  }

  render(data) {
    this.carSvg.style.fill = data.color;

    return `<section class="profile" id="${data.id}">
    <div class="car-info">
    <div><h1>${data.brand} ${data.model}</h1>
    <p>Год:<span> ${data.year}</span></p>
    <p>Цвет:<span> ${data.color}</span></p>
    <p>Регистрационный номер:<span> ${data.carPlate}</span></p>
    <p>Пробег:<span class="mileage-info"> ${data.mileage}</span></p>
    </div>
    <div class="car-img">${this.carSvg.outerHTML}</div>
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
    return `<li class= "list-item" id=${data.id}><p><span>${
      data.name
    } </span><span>${data.number} </span><span>${data.brand} </span><span>${
      data.cost
    } руб.</span><p>
    <p>${new Date(data.timestamp).toDateString()}</p></li>`;
  }

  openModalWindow() {
    ModalWindowNoteMod.view.showModalWindow();
  }

  renderUpdateMileage(data) {
    const mileage = document.querySelector(".mileage-info");
    mileage.textContent = data.mileage;
  }

  renderNoteList(profileId) {
    this.partsList = document.querySelector(".installed-parts-list");
    this.partsList?.remove();
    if (!document.querySelector(".note-list")) {
      const list = `<div class="note-list" id ="note-list"><span class="loader"></span></div>`;
      this.container?.insertAdjacentHTML("beforeend", list);
      NoteList.render(profileId);
    }
  }

  async renderParts(profileId) {
    this.container = document.querySelector(".profile");
    this.partsList = document.createElement("ol");
    this.partsList.classList.add("installed-parts-list");

    const div = `<div><p>Запчасти:</p><p>Дата установки:</p></div>`;

    this.partsList.insertAdjacentHTML("beforeend", div);
    const noteList = document.querySelector(".note-list");
    noteList?.remove();

    if (!document.querySelector(".exists")) {
      this.loader = document.createElement("span");
      this.loader.classList.add("exists");
      this.container.append(this.loader);
    }

    if (!document.querySelector(".installed-parts-list")) {
      this.loader.classList.add("loader");
      const snapshot = await Firebase.getItemsArr(
        `${Firebase.pathUserCars}/${profileId}/parts`
      );
      this.loader.classList.remove("loader");

      snapshot.forEach((el) => {
        this.partsList.innerHTML += this.createPartsListItem(el.data());
      });
      this.container.append(this.partsList);
    }
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
    this.view.renderParts(profileId);
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
          this.model.renderNoteList(this.profileId);
          if (!document.querySelector(".soundOff")) {
            click.play();
          }
          break;
        case installedParts:
          this.model.showParts(this.profileId);
          if (!document.querySelector(".soundOff")) {
            click.play();
          }
          break;
        case addNote:
          this.model.openModalWindow();
          if (!document.querySelector(".soundOff")) {
            modal.play();
          }
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
