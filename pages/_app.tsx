// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { Web3ReactProvider } from "@web3-react/core";
import store from "../store";
import { Provider } from "react-redux";
import Web3 from "web3";

const getWeb3Library = (provider: any) => new Web3(provider);

const MyApp = ({ Component, pageProps }) => {
  return (
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <Provider store={store}>
        <ChakraProvider>
          <Navbar></Navbar>
          <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
    </Web3ReactProvider>
  );
};

export default MyApp;
