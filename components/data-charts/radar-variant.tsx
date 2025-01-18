import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0062ff", "#12C6FF", "#FF647F", "#FF9654"];

type Props = {
  data?: {
    value: number;
    name: string;
  }[];
};

export function RadarVariant({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx={"50%"} cy={"50%"} outerRadius={"50%"} data={data}>
        <PolarGrid />
        <PolarAngleAxis style={{ fontSize: "12px" }} dataKey="name" />
        <PolarRadiusAxis style={{ fontSize: "12px" }} />
        <Radar dataKey={"value"} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
