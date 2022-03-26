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
import { transformedLoss } from "../../types";
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
          <AreaChart
            data={props.data}
            margin={{
              top: 20,
              right: 35,
              left: 0,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={props.color} stopOpacity={0.65} />
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area
              type="basis"
              dataKey="amount"
              stroke={props.color}
              name={props.name}
              dot={false}
              strokeWidth={"2"}
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
            {props.maxOnBorder ? (
              <ReferenceLine
                y={props.maxOnBorder}
                ifOverflow="extendDomain"
                stroke="red"
                label={`Всього біля границі(${props.maxOnBorder})`}
                fontWeight="bold"
              />
            ) : null}
            {props.maxInGeneral ? (
              <ReferenceLine
                y={props.maxInGeneral}
                ifOverflow="extendDomain"
                stroke="blue"
                label={`Всього(${props.maxInGeneral})`}
                fontWeight="bold"
              />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
