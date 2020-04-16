import { useState } from "react";
import { NextPage } from "next";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { FormControlProps } from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import StateDropdown from "../components/StateDropdown";

import fetch from "../lib/fetch";

type CTPDataPoint = {
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
};

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
  console.log("Data", data);

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
    </Container>
  );
};

export default Index;
