import { useState } from "react";
import { NextPage } from "next";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { FormControlProps } from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import StateDropdown from "../components/StateDropdown";
import CTPPlot, { CTPDataPoint } from "../components/CTPPlot";

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

  const onChange: FormControlProps["onChange"] = async (
    event
  ): Promise<void> => {
    const state = event.currentTarget.value;
    const results = await fetchCovidData(state);

    setData(results);
  };

  return (
    <Container>
      <Row>
        <Col>
          <StateDropdown onChange={onChange} />
        </Col>
      </Row>
      <Row>
        <Col>{data && <CTPPlot data={data} />}</Col>
      </Row>
    </Container>
  );
};

export default Index;
