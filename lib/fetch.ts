import fetch from "isomorphic-unfetch";

type Fetch = typeof fetch;
const modifiedFetch: Fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  }

  const error = new Error(response.statusText);

  throw error;
};

export default modifiedFetch;
