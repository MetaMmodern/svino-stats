import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { parse } from "node-html-parser";
import Chart from "../components/Chart";
enum lossesTypes {
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
}
type singleLoss = {
  lossName: lossesTypes;
  lossAmount: number;
};
type dayLosses = {
  day: string;
  losses: singleLoss[];
};
type transformedLosses = {
  [key in keyof typeof lossesTypes]: { day: string; amount: number }[];
};
const Home: NextPage<{ allLosses: Array<dayLosses> }> = (props) => {
  const transformedLosses: transformedLosses = props.allLosses.reduce(
    (result, currentDay) => {
      const newResult = { ...result };
      console.log(newResult);
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
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Chart data="a" />
      <code>{JSON.stringify(transformedLosses, null, 2)}</code>
      {/* <div>
        {Array.from(
          new Set(
            props.allLosses
              .map((day) => day.losses.map((losses) => losses.lossName))
              .flat()
          )
        ).map((el, key) => (
          <h4 key={key}>{el}</h4>
        ))}
      </div> */}
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>
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

  const normalizedLosses = allLosses.map((day) => {
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
  });
  return {
    props: {
      allLosses: normalizedLosses,
    },
  };
}

export default Home;