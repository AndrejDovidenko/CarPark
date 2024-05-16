import ModalWindowNoteMod from "./ModalWindowNoteMod";
import Firebase from "./FirebaseAPI";
import { click, modal } from "../constants/constants";

class NoteListView {
  constructor() {
    this.container = null;
  }

  async renderNotes(profileId) {
    const arr = await Firebase.getItemsArr(
      `${Firebase.pathUserCars}/${profileId}/notes`
    );

    let html = ``;

    arr.forEach((el) => {
      html += this.createNoteBlock(el.data());
    });

    return html;
  }

  render(profileId) {
    this.renderNotes(profileId)
      .then((html) => {
        this.container = document.querySelector("#note-list");
        this.container.innerHTML = html;
      })
      .catch((error) => {
        console.error(error);
        this.container.innerHTML = "<p>Ошибка при загрузке данных</p>";
      });
    return `<div class="note-list" id ="note-list"><span class="loader"></span></div>`;
  }

  createNoteBlock(data) {
    return `<div class="note-block" id="${data.id}">
 <div class="info-note-list">

 <p>${new Date(data.timestamp).toDateString()}</p>
 <p>${data.description}</p>
 <p>Стоимость: ${data.cost}</p>
 <p>Пробег: ${data.mileage}</p>
 ${data.list} 
 </div>
 <div class="control">
 <button class="btn remove-note">Удалить</button>
 <button class="btn update-note">Изменить</button>
 </div>
  </div>`;
  }

  renderNoteBlock(data) {
    const block = this.createNoteBlock(data);
    this.container.insertAdjacentHTML("beforeend", block);
  }

  updateNoteBlock(data) {
    const block = this.container.querySelector(`#${data.id}`);
    const newBlock = new DOMParser()
      .parseFromString(this.createNoteBlock(data), "text/html")
      .querySelector(".note-block");

    block.replaceWith(newBlock);
  }

  removeItem(item) {
    item.remove();
  }

  openModalWindow(data) {
    ModalWindowNoteMod.view.showModalWindow(data);
  }

  openText(item) {
    item.classList.toggle("open-text");
  }
}

class NoteListModel {
  constructor(view) {
    this.view = view;
  }

  removeItem(item, profileId) {
    this.view.removeItem(item);
    Firebase.deleteItem(item.id, `${Firebase.pathUserCars}/${profileId}/notes`);
  }

  async openModalWindow(itemId, profileId) {
    const data = await Firebase.getItem(
      `${Firebase.pathUserCars}/${profileId}/notes`,
      itemId
    );

    this.view.openModalWindow(data);
  }

  openText(item) {
    this.view.openText(item);
  }
}

class NoteListController {
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
    const clickBlock = event.target.closest(".note-block");
    const removeNote = event.target.closest(".remove-note");
    const updateNote = event.target.closest(".update-note");
    const clickButton = removeNote || updateNote || null;

    this.profileId = document.querySelector(".profile")?.id;

    if (clickBlock) {
      switch (clickButton) {
        case null:
          this.model.openText(clickBlock);
          if (!document.querySelector(".soundOff")) {
            click.play();
          }
          break;
        case removeNote:
          const item = event.target.closest(".note-block");
          this.model.removeItem(item, this.profileId);
          if (!document.querySelector(".soundOff")) {
            click.play();
          }
          break;
        case updateNote:
          this.model.openModalWindow(clickBlock.id, this.profileId);
          if (!document.querySelector(".soundOff")) {
            modal.play();
          }
          break;
      }
    }
  }
}

class NoteListMain {
  constructor() {
    this.view = new NoteListView();
    this.model = new NoteListModel(this.view);
    this.controller = new NoteListController(
      this.model,
      document.querySelector("#root")
    );
  }

  render(profileId) {
    return this.view.render(profileId);
  }
}

const NoteList = new NoteListMain();

export default NoteList;
