import { useState } from "react";
import { createContext } from "react";
import { FullProof, FullProveInput } from "../types";

interface IBackgroundProvingContext {
  isProving: boolean;
  fullProof: FullProof | null;
  startProving: (input: FullProveInput) => void;
}

const defaultState = {
  isProving: false,
  fullProof: null
};

const BackgroundProvingContext = createContext<IBackgroundProvingContext>(
  defaultState as IBackgroundProvingContext
);

export const BackgroundProvingContextProvider = ({ children }) => {
  const [isProving, setIsProving] = useState<boolean>(false);
  const [fullProof, setFullProof] = useState<FullProof | null>(null);

  const startProving = input => {
    const worker = new Worker(
      new URL("../lib/webworkers/prover.js", import.meta.url)
    );

    worker.onmessage = e => {
      if (e.data instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(e.data);
        // TODO: Report error to Sentry
      } else {
        const _fullProof = e.data;
        setFullProof(_fullProof);
      }
    };

    setIsProving(true);
    worker.postMessage(input);
  };

  return (
    <BackgroundProvingContext.Provider
      value={{
        fullProof,
        isProving,
        startProving
      }}
    >
      {children}
    </BackgroundProvingContext.Provider>
  );
};

export default BackgroundProvingContext;
