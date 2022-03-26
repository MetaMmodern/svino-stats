import { lossesTypes } from "../utils/constants";

export type singleLoss = {
  lossName: lossesTypes;
  lossAmount: number;
};
export type dayLosses = {
  day: string;
  losses: singleLoss[];
};

export type transformedLoss = { day: string; amount: number };
export type transformedLosses = {
  -readonly [key in keyof typeof lossesTypes]: transformedLoss[];
};
