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
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import ConnectWalletModal from "../components/ConnectWalletModal";
import { ConnectWalletModalProvider } from "../contexts/ConnectWalletModalContext";
import { CreateFormContextProvider } from "../contexts/CreateFormContext";

const chains = [chain.hardhat, chain.goerli];

const { provider } = configureChains(chains, [
  jsonRpcProvider({
    rpc: chain => {
      if (chain.id !== 31337) return null;
      return { http: chain.rpcUrls.default };
    }
  }),
  alchemyProvider({ apiKey: "PT2E3_7VyBJKUCSi_46fGUjKO0bC0auG" })
]);

const client = createClient({
  autoConnect: false,
  provider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi"
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true
      }
    })
  ]
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
      <ConnectWalletModalProvider>
        <CreateFormContextProvider>
          <Navbar></Navbar>
          <Component pageProps={pageProps} />
          <ConnectWalletModal></ConnectWalletModal>
        </CreateFormContextProvider>
      </ConnectWalletModalProvider>
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
