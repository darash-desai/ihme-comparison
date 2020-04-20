import { Line } from "react-chartjs-2";
import { ChartPoint } from "chart.js";

import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

export interface CTPDataPoint {
  date: number;
  state: string;
  positive: number;
  negative: number;
  hospitalizedCurrently?: number;
  hospitalizedCumulative?: number;
  inIcuCurrently?: number;
  recovered: number;
  death: number;
  total: number;
  fips: string;
}

type CTPDatum = keyof CTPDataPoint;

interface CTPPlotProps {
  data: CTPDataPoint[];
}

const extractData = (
  data: CTPDataPoint[],
  xData: CTPDatum,
  yData: CTPDatum
): ChartPoint[] => {
  return data.map((dataPoint) => {
    // Reformat string for parsing
    const dateString = dataPoint.date
      .toString()
      .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

    const date = dayjs(dateString, "YYYY-MM-DD");
    const xPoint = xData === "date" ? date.toDate() : dataPoint[xData];

    return {
      x: xPoint,
      y: dataPoint[yData],
    };
  });
};

const CTPPlot = ({ data }: CTPPlotProps): JSX.Element => {
  const plotData = extractData(data, "date", "death");
  plotData.sort((a, b) => (a.x as Date).getTime() - (b.x as Date).getTime());

  const labels = plotData.map((dataPoint) =>
    dayjs(dataPoint.x as Date).format("MMM D")
  );
  const chartData = {
    labels,
    datasets: [
      {
        label: "Actual Deaths",
        data: plotData,
      },
    ],
  };

  return <Line data={chartData}></Line>;
};

CTPPlot.displayName = "CTPPlot";

export default CTPPlot;
