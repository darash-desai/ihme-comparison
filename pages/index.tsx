import { NextPage } from "next";
import fetch from "../lib/fetch";

type Unpacked<T> = T extends Promise<infer U> ? U : T;
type JSON = Unpacked<ReturnType<InstanceType<typeof Response>["json"]>>;

interface IndexProps {
  data: JSON;
}

const Index: NextPage<IndexProps> = (props) => {
  console.log("Data", props.data);
  return (
    <div>
      <p>Hello Next.js</p>
      <p>{props.data.toString()}</p>
    </div>
  );
};

Index.getInitialProps = async (): Promise<IndexProps> => {
  const response = await fetch("https://covidtracking.com/api/states/daily");
  return {
    data: await response.json(),
  };
};

export default Index;
