class CarListView {
  constructor() {}

  render() {
    return `<div class="car-list">
    <div></div>
    </div>`;
  }
}

class CarListModel {
  constructor(view) {
    this.view = view;
  }
}

class CarListController {
  constructor(model) {
    this.model = model;
  }
}

class CarListMain {
  constructor() {
    this.view = new CarListView();
    this.model = new CarListModel(this.view);
    this.controller = new CarListController(this.model);
  }
  render() {
    return this.view.render();
  }
}

const CarList = new CarListMain();

export default CarList;
