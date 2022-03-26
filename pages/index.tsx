import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { parse } from "node-html-parser";
import Chart from "../components/Chart";
import { dayLosses, singleLoss, transformedLosses } from "../types";
import { datesFiller } from "../utils/datesFiller";
import {
  lossesTypes,
  maxAmountsInGeneral,
  maxAmountsNearBorders,
} from "../utils/constants";

const Home: NextPage<{ allLosses: Array<dayLosses> }> = (props) => {
  const localTransformedLosses: transformedLosses = props.allLosses.reduce(
    (result, currentDay) => {
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
    },
    {} as transformedLosses
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

  return (
    <div className={styles.container}>
      <Head>
        <title>СвиноСтат</title>
        <meta name="description" content="статистика втрат свиноорків." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h2 className={styles.title}>
          Статистика втрат орків з початку війни в Україні.
        </h2>
      </header>
      <main className={styles.main}>
        <div className={styles.grid}>
          {Object.entries(localTransformedLosses).map((lossEntry, idx) => {
            return (
              <Chart
                name={lossEntry[0]}
                data={lossEntry[1]}
                color={"green"}
                key={idx}
                maxOnBorder={
                  maxAmountsNearBorders[
                    lossEntry[0] as unknown as lossesTypes
                  ] ?? undefined
                }
                maxInGeneral={
                  maxAmountsInGeneral[lossEntry[0] as unknown as lossesTypes] ??
                  undefined
                }
              />
            );
          })}
        </div>
      </main>
      <footer>хехе</footer>
    </div>
  );
};

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch(
    "https://index.minfin.com.ua/ua/russian-invading/casualties/"
  );
  const text = await res.text();
  const translate = {
    "&nbsp": " ",
    "&amp": "&",
    "&quot": '"',
    "&lt": "<",
    "&gt": ">",
  };
  const validText = Object.entries(translate).reduce((acc, curr) => {
    return acc.replaceAll(curr[0], curr[1]);
  }, text);
  const htmlDoc = parse(validText, {
    comment: false,
    blockTextElements: {
      script: false, // keep text content when parsing
      noscript: false, // keep text content when parsing
      style: false, // keep text content when parsing
      pre: false, // keep text content when parsing
    },
  });
  const daysElements = htmlDoc.querySelectorAll("li.gold");

  const replacings = { РСЗВ: ["РСЗВ", "РСЗВ Град", "ЗРК БУК"] };
  const allLosses: Array<dayLosses> = Array.from(daysElements)
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

  const normalizedLosses = allLosses
    .map((day) => {
      return {
        ...day,
        losses: day.losses.map((loss) => {
          const newName =
            Object.entries(replacings).map((entry) =>
              entry[1].includes(loss.lossName.toString())
                ? entry[0]
                : loss.lossName
            )[0] ?? loss.lossName;
          return { ...loss, lossName: newName };
        }),
      };
    })
    .reverse();
  return {
    props: {
      allLosses: normalizedLosses,
    },
  };
}

export default Home;
