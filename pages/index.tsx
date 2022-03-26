import type { NextPage } from "next";

import Head from "next/head";
import styles from "../styles/Home.module.css";
import { parse } from "node-html-parser";
import Chart from "../components/Chart/Chart";
import { dayLosses, transformedLosses } from "../types";
import {
  lossesTypes,
  maxAmountsInGeneral,
  maxAmountsNearBorders,
} from "../utils/constants";
import {
  datesFillerForAllDays,
  datesSimplifier,
  elementsToObject,
  htmlNormalizer,
  normalizeLosses,
  transformLosses,
} from "../utils/dataParser";
import Footer from "../components/Footer/Footer";

const Home: NextPage<{ allLosses: Array<dayLosses> }> = (props) => {
  const localTransformedLosses: transformedLosses = datesSimplifier(
    datesFillerForAllDays(transformLosses(props.allLosses))
  );

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
      <Footer />
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch(
    "https://index.minfin.com.ua/ua/russian-invading/casualties/"
  );
  const text = await res.text();
  const validText = htmlNormalizer(text);
  const htmlDoc = parse(validText, {
    comment: false,
    blockTextElements: {
      script: false,
      noscript: false,
      style: false,
      pre: false,
    },
  });
  const daysElements = htmlDoc.querySelectorAll("li.gold");

  const allLosses: Array<dayLosses> = elementsToObject(daysElements);

  const normalizedLosses = normalizeLosses(allLosses);
  return {
    props: {
      allLosses: normalizedLosses,
    },
  };
}

export default Home;
