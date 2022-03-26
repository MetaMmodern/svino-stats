import {
  LineChart,
  Line,
  XAxis,
  ReferenceLine,
  CartesianGrid,
  YAxis,
} from "recharts";

const data = [{ name: "Page A", uv: 400, pv: 2400, amt: 2400 }];

type chartProps = {
  data: string;
};
const Chart: React.FunctionComponent<chartProps> = (props) => {
  return (
    <LineChart width={400} height={400} data={data}>
      <ReferenceLine y="4000" stroke="green" label="Min PAGE" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis xHeight={100} height={100} />
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  );
};

export default Chart;
