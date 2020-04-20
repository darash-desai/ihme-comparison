import { useState } from "react";
import { NextPage } from "next";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { FormControlProps } from "react-bootstrap/FormControl";
import IHMEParser, { IHMEParserProps } from "../components/IHMEParser";
import Row from "react-bootstrap/Row";
import StateDropdown from "../components/StateDropdown";
import CTPPlot, { CTPDataPoint } from "../components/CTPPlot";

import { Line } from "react-chartjs-2";
import { ChartPoint, TimeUnit } from "chart.js";

import fetch from "../lib/fetch";

/**
 * Fetches data from The COVID Tracking Project.
 *
 * @param state An optional state by which to filter the data
 */
const fetchCovidData = async (
  state: string | null
): Promise<CTPDataPoint[]> => {
  let url = "https://covidtracking.com/api/states/daily";
  if (state) {
    url += `?state=${state}`;
  }

  const response = await fetch(url);
  return await response.json();
};

const Index: NextPage = () => {
  const [data, setData] = useState<CTPDataPoint[] | null>(null);

  type ChartData = { [key: string]: ChartPoint[] };
  const [chartData, setChartData] = useState<ChartData>({});

  const onChange: FormControlProps["onChange"] = async (
    event
  ): Promise<void> => {
    const state = event.currentTarget.value;
    const results = await fetchCovidData(state);

    setData(results);
  };

  const onIHMEUpdate: IHMEParserProps["onUpdate"] = (data) => {
    setChartData(data);
  };

  const lineData = {
    datasets: Object.keys(chartData)
      .sort()
      .map((key) => {
        return {
          label: key,
          data: chartData[key],
        };
      }),
  };

  const options = {
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "day" as TimeUnit,
          },
        },
      ],
    },
  };

  return (
    <Container>
      <Row>
        <Col>
          <StateDropdown onChange={onChange} />
        </Col>
      </Row>
      <Row>
        <Col>
          <IHMEParser onUpdate={onIHMEUpdate} />
        </Col>
      </Row>
      <Row>
        <Col>{data && <CTPPlot data={data} />}</Col>
      </Row>
      <Row>
        <Col>
          <Line data={lineData} options={options}></Line>
        </Col>
      </Row>
    </Container>
  );
};

export default Index;
