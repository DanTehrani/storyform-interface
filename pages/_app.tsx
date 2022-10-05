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
import { EditFormContextProvider } from "../contexts/EditFormContext";
import { BackgroundProvingContextProvider } from "../contexts/ProverContext";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import loadable from "@loadable/component"; // npm install @loadable/component
const Feedback = loadable(() => import("feeder-react-feedback/dist/Feedback")); // dynamically load Feedback component
import "feeder-react-feedback/dist/feeder-react-feedback.css"; // import stylesheet
import { useRouter } from "next/router";

Sentry.init({
  dsn: "https://afa37196f4324ff8950f0baa5f4a29f5@o1348995.ingest.sentry.io/6628427",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  beforeSend: (event, hint) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(hint.originalException);
      return null;
    }

    return event;
  }
});

const chains = [chain.mainnet, chain.goerli];

const { provider } = configureChains(chains, [
  jsonRpcProvider({
    rpc: chain => {
      return { http: chain.rpcUrls.default };
    }
  }),
  alchemyProvider({ apiKey: "PT2E3_7VyBJKUCSi_46fGUjKO0bC0auG" })
]);

const client = createClient({
  autoConnect: process.env.NODE_ENV !== "development",
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
      // @ts-ignore
      // NEXT_PUBLIC_CHAIN_ID is set to 5 (Goerli) in env.development
      const chainId: string = process.env.NEXT_PUBLIC_CHAIN_ID;
      if (chainId) {
        switchNetwork(parseInt(chainId));
      }
    }
  }, [switchNetwork]);

  return (
    <ChakraProvider>
      <ConnectWalletModalProvider>
        <EditFormContextProvider>
          <CreateFormContextProvider>
            <BackgroundProvingContextProvider>
              <Navbar></Navbar>
              <Component pageProps={pageProps} />
              <ConnectWalletModal></ConnectWalletModal>
            </BackgroundProvingContextProvider>
          </CreateFormContextProvider>
        </EditFormContextProvider>
      </ConnectWalletModalProvider>
    </ChakraProvider>
  );
};

const MyApp = ({ Component, pageProps }) => {
  const { pathname } = useRouter();

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
      {pathname !== "/forms/[formId]" ? ( // Don't show feedback on the form page
        <Feedback
          projectId="63218fdbbcec77000438beb0"
          projectName="Storyform"
        />
      ) : (
        <></>
      )}
      <WagmiConfig client={client}>
        <Provider Component={Component} pageProps={pageProps}></Provider>
      </WagmiConfig>
    </ErrorBoundary>
  );
};

export default MyApp;
