export const TRANSLATABLE = {
  "&nbsp": " ",
  "&amp": "&",
  "&quot": '"',
  "&lt": "<",
  "&gt": ">",
};
export const REPLACINGS = { РСЗВ: ["РСЗВ", "РСЗВ Град", "ЗРК БУК"] };

export const START_DATE = new Date(2022, 1, 24);
export const ONE_DAY_MS = 1000 * 3600 * 24;
export enum lossesTypes {
  "Танки",
  "ББМ",
  "Літаки",
  "Гелікоптери",
  "Гармати",
  "Автомобілі",
  "РСЗВ",
  "Засоби ППО",
  "БПЛА",
  "Цистерни з ППМ",
  "Кораблі (катери)",
  "Спеціальна техніка",
  "Особовий склад",
  "Пускові установки ОТРК",
}
export const maxAmountsNearBorders: {
  [key in keyof typeof lossesTypes]?: number;
} = {
  Танки: 1200,
  ББМ: 2900,
  Літаки: 330,
  Гелікоптери: 240,
  "Особовий склад": 140000,
};

export const maxAmountsInGeneral: {
  [key in keyof typeof lossesTypes]?: number;
} = {
  Танки: 3300,
  ББМ: 13760,
  Літаки: 1380,
  Гелікоптери: 960,
  // "Особовий склад": 900000,
};
