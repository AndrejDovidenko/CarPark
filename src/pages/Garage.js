const Garage = {
  id: "main",
  title: "Главная страница примера SPA",
  render: (className = "container", ...rest) => {
    const x = new GarageView();
    return x.render(className);
  },
};

export default Garage;

class GarageView {
  constructor() {
    // this.init();
  }

  render(className = "container") {
    return `<section class="${className}">
        <h1>Garage</h1>
        <button class="${className}__btn ">Добавить авто
        </button>
      </section>
    `;
  }
}

class GarageModel {}

class GarageController {}
