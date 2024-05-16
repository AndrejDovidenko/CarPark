import clickAudio from "../audio/click.mp3";
import openAudio from "../audio/open.mp3";
import modalAudio from "../audio/modal.mp3";

export const OPTIONS = {
  brands: ["Не выбрано", "Hyundai", "KIA", "Lada", "Renault", "Volkswagen"],
  models: [
    ["Не выбрано"],
    [
      "Не выбрано",
      "Accent",
      "Creta",
      "Elantra",
      "Genesis",
      "Santa Fe",
      "Solaris",
      "Sonata",
      "Tucson",
      "i30",
      "i40",
    ],
    [
      "Не выбрано",
      "Ceed",
      "Ceed SW",
      "Cerato",
      "Optima",
      "Picanto",
      "Rio",
      "Sorento",
      "Soul",
      "Sportage",
      "Stinger",
    ],
    [
      "Не выбрано",
      "Granta",
      "Kalina",
      "Largus",
      "Niva",
      "Priora",
      "Vesta",
      "Vesta Cross",
      "XRAY",
    ],
    [
      "Не выбрано",
      "Dokker",
      "Duster",
      "Fluence",
      "Kaptur",
      "Laguna",
      "Logan",
      "Megan",
      "Sandero",
      "Talisman",
      "Trafic",
    ],
    [
      "Не выбрано",
      "Caddy",
      "Caravelle",
      "Golf",
      "Jetta",
      "Passat",
      "Polo",
      "Polo sedan",
      "Sharan",
      "Transporter",
      "Vento",
    ],
  ],
};

const startYear = 1980;
const currentYear = new Date().getFullYear();

export const ALL_YEARS = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => startYear + i
);

ALL_YEARS.unshift("Не выбрано");

export const click = new Audio(clickAudio);
export const open = new Audio(openAudio);
export const modal = new Audio(modalAudio);
