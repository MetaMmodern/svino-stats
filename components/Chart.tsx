import {
  LineChart,
  Line,
  XAxis,
  ReferenceLine,
  CartesianGrid,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip,
} from "recharts";
import { transformedLoss } from "../types";
import styles from "./Chart.module.css";

type chartProps = {
  data: transformedLoss[];
  color: string;
  name: string;
  maxOnBorder?: number;
  maxInGeneral?: number;
};
const Chart: React.FunctionComponent<chartProps> = (props) => {
  return (
    <div className={styles.chartContainer}>
      <h3>{props.name}</h3>
      <div className={styles.chart}>
        <ResponsiveContainer>
          <LineChart
            data={props.data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={props.color}
              name={props.name}
            />
            {props.maxOnBorder ? (
              <ReferenceLine
                y={props.maxOnBorder}
                ifOverflow="extendDomain"
                stroke="red"
                label={`Всього біля границі(${props.maxOnBorder})`}
              />
            ) : null}
            {props.maxInGeneral ? (
              <ReferenceLine
                y={props.maxInGeneral}
                ifOverflow="extendDomain"
                stroke="blue"
                label={`Всього(${props.maxInGeneral})`}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
