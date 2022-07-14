// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "ethers";
import store from "../store";
import { Provider } from "react-redux";

const getWeb3Library = (provider: any): providers.Web3Provider =>
  // Can be switched to web3js in the future
  new providers.Web3Provider(provider);

const MyApp = ({ Component, pageProps }) => {
  return (
    <Web3ReactProvider getLibrary={getWeb3Library}>
      <Provider store={store}>
        <ChakraProvider>
          <Navbar></Navbar>
          <Container maxW="1228px">
            <Component {...pageProps} />
          </Container>
        </ChakraProvider>
      </Provider>
    </Web3ReactProvider>
  );
};

export default MyApp;
