import { transformedLoss } from "./../types/index";
import { ONE_DAY_MS, START_DATE } from "./constants";
export function datesFiller(date: string): transformedLoss[] {
  const datePieces = date.split(".").map(Number);
  const validDate = new Date(datePieces[2], datePieces[1] - 1, datePieces[0]);
  if (validDate > START_DATE) {
    const numberOfDays =
      (validDate.getTime() - START_DATE.getTime()) / ONE_DAY_MS;
    return Array.from(Array(numberOfDays).keys()).map((v) => {
      const date = new Date(START_DATE.getTime() + ONE_DAY_MS * v);
      return {
        day: `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`,
        amount: 0,
      };
    });
  }
  return [];
}
