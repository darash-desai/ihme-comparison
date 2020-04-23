import { AppProps } from "next/app";

import "../styles.scss";

const IHMEComparisonApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <Component {...pageProps} />;
};

export default IHMEComparisonApp;
