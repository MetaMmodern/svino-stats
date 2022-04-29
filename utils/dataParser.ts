import { HTMLElement } from "node-html-parser";
import { dayLosses, singleLoss, transformedLosses } from "../types";
import { lossesTypes, REPLACINGS, TRANSLATABLE } from "./constants";
import { datesFiller } from "./datesFiller";
export const htmlNormalizer = (s: string) => {
  return Object.entries(TRANSLATABLE).reduce((acc, curr) => {
    return acc.replaceAll(curr[0], curr[1]);
  }, s);
};

export const elementsToObject = (els: HTMLElement[]): Array<dayLosses> => {
  return Array.from(els)
    .filter((el) => {
      const dateRegEx = new RegExp(/\d{2}\.\d{2}\.\d{4}/);
      return dateRegEx.test(el.querySelector(".black")?.innerHTML ?? "");
    })
    .map((el) => {
      const day = el.querySelector(".black")?.innerHTML ?? "";
      const lossesPerDay = el
        .querySelectorAll(".casualties")
        .map((casualty) => casualty.querySelectorAll("li"))
        .flat()
        .map((el) => el.innerText); // good luck refactoring this spaghetti😁
      const losses: singleLoss[] = lossesPerDay.map((str) => {
        const pair = str.split("&mdash;").map((s) => s.trim());
        return {
          lossName: pair[0]
            .replaceAll(";", "")
            .trim() as unknown as lossesTypes,
          lossAmount: Number(pair[1].match(/\d+/)?.shift()) ?? 0,
        };
      });
      return { day, losses };
    });
};

export const normalizeLosses = (allLosses: Array<dayLosses>) => {
  return allLosses
    .map((day) => {
      return {
        ...day,
        losses: day.losses.map((loss) => {
          const newName =
            Object.entries(REPLACINGS).map((entry) =>
              entry[1].includes(loss.lossName.toString())
                ? entry[0]
                : loss.lossName
            )[0] ?? loss.lossName;
          return { ...loss, lossName: newName };
        }),
      };
    })
    .reverse();
};

export const transformLosses = (allLosses: Array<dayLosses>) => {
  return allLosses.reduce((result, currentDay) => {
    const newResult = { ...result };
    currentDay.losses.forEach((loss) => {
      newResult[loss.lossName] = [
        ...(Array.isArray(result[loss.lossName])
          ? newResult[loss.lossName]
          : []),
        {
          day: currentDay.day,
          amount: loss.lossAmount,
        },
      ];
    });
    return newResult;
  }, {} as transformedLosses);
};

export const datesFillerForAllDays = (incomingLosses: transformedLosses) => {
  const localTransformedLosses: transformedLosses = JSON.parse(
    JSON.stringify(incomingLosses)
  );

  for (const key in lossesTypes) {
    if (
      Object.prototype.hasOwnProperty.call(lossesTypes, key) &&
      !isNaN(Number(key))
    ) {
      const value = lossesTypes[key];
      localTransformedLosses[value as unknown as lossesTypes] = [
        ...datesFiller(
          localTransformedLosses[value as unknown as lossesTypes][0].day
        ),
        ...localTransformedLosses[value as unknown as lossesTypes],
      ];
    }
  }
  return localTransformedLosses;
};

export const datesSimplifier = (incomingLosses: transformedLosses) => {
  const localTransformedLosses: transformedLosses = JSON.parse(
    JSON.stringify(incomingLosses)
  );
  for (const key in lossesTypes) {
    if (
      Object.prototype.hasOwnProperty.call(lossesTypes, key) &&
      !isNaN(Number(key))
    ) {
      const value = lossesTypes[key];
      localTransformedLosses[value as unknown as lossesTypes] = [
        ...localTransformedLosses[value as unknown as lossesTypes].map(
          (el) => ({
            ...el,
            day: el.day
              .split(".")
              .slice(0, 2)
              .map((e) => ("0" + e).slice(-2))
              .join("."),
          })
        ),
      ];
    }
  }
  return localTransformedLosses;
};
