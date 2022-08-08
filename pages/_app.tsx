// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import {
  WagmiConfig,
  createClient,
  useSwitchNetwork,
  chain,
  configureChains
} from "wagmi";
import { useEffect } from "react";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/ErrorFallback";

const { provider } = configureChains(
  [chain.hardhat, chain.goerli],
  [
    jsonRpcProvider({
      rpc: chain => {
        if (chain.id !== 31337) return null;
        return { http: chain.rpcUrls.default };
      }
    }),
    alchemyProvider({ apiKey: "PT2E3_7VyBJKUCSi_46fGUjKO0bC0auG" })
  ]
);

const client = createClient({
  autoConnect: false,
  provider
});

const Provider = ({ Component, pageProps }) => {
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (switchNetwork) {
      const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "31337";
      if (chainId) {
        switchNetwork(parseInt(chainId));
      }
    }
  }, [switchNetwork]);

  return (
    <ChakraProvider>
      <Navbar></Navbar>
      <Component pageProps={pageProps} />
    </ChakraProvider>
  );
};

const MyApp = ({ Component, pageProps }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error: Error, info: { componentStack: string }) => {
        // eslint-disable-next-line no-console
        console.error(error);
        // eslint-disable-next-line no-console
        console.error(info);
        // TODO Report to Sentry
      }}
    >
      <WagmiConfig client={client}>
        <Provider Component={Component} pageProps={pageProps}></Provider>
      </WagmiConfig>
    </ErrorBoundary>
  );
};

export default MyApp;
