import { useState } from "react";
import { createContext } from "react";
import { FullProof, FullProveInput } from "../types";

interface IBackgroundProvingContext {
  isProving: boolean;
  fullProof: FullProof | null;
  startProving?: (input: FullProveInput) => void;
}

const defaultState = {
  isProving: false,
  fullProof: null
};

const BackgroundProvingContext =
  createContext<IBackgroundProvingContext>(defaultState);

export const BackgroundProvingContextProvider = ({ children }) => {
  const [isProving, setIsProving] = useState<boolean>(false);
  const [fullProof, setFullProof] = useState<FullProof | null>(null);

  let worker, startProving;
  try {
    // Worker is not available in Next.js SSR, so we try until the component is rendered on the client side
    worker = new Worker(
      new URL("../lib/webworkers/prover.js", import.meta.url)
    );

    worker.onmessage = e => {
      if (e.data instanceof Error) {
        // Report error to Sentry
      } else {
        const _fullProof = e.data;
        setFullProof(_fullProof);
      }
    };

    startProving = (input: FullProveInput) => {
      setIsProving(true);
      worker.postMessage(input);
    };
  } catch (err) {
    //
  }

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
