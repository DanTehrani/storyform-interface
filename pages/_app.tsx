// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import store from "../store";
import { Provider } from "react-redux";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";

const client = createClient({
  autoConnect: false,

  provider: getDefaultProvider()
});

const MyApp = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <Provider store={store}>
        <ChakraProvider>
          <Navbar></Navbar>
          <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
    </WagmiConfig>
  );
};

export default MyApp;
