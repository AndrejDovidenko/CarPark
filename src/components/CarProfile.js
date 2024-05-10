import carImgSvg from "../img/car.svg";
import { generateSvg } from "../constants/generateSVG";

class CarProfileView {
  constructor() {
    // this.render({});
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
    return `<h1>Профиль ${data.brand} ${data.model}</h1>
    <p>${data.year}</p>
    <p>${data.color}</p>
    <p>${data.carPlate}</p>
    <p>${data.mileage}</p>
    <div class="car-img"> ${this.carSvg.outerHTML}</div>`;
  }
}

class CarProfileModel {
  constructor(view) {
    this.view = view;
  }
}

class CarProfileController {
  constructor(model) {
    this.model = model;
  }
}

class CarProfileMain {
  constructor() {
    this.view = new CarProfileView();
    this.model = new CarProfileModel(this.view);
    this.controller = new CarProfileController(this.model);
  }

  render(data) {
    return this.view.render(data);
  }
}

const CarProfile = new CarProfileMain();

export default CarProfile;
