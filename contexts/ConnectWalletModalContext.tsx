import { useState } from "react";
import { createContext } from "react";

interface IConnectWalletModalContext {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const defaultState = {
  isOpen: false,
  open: () => null,
  close: () => null
};

const ConnectWalletModalContext =
  createContext<IConnectWalletModalContext>(defaultState);

export const ConnectWalletModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const close = () => {
    setIsOpen(false);
  };

  const open = () => {
    setIsOpen(true);
  };

  return (
    <ConnectWalletModalContext.Provider
      value={{
        isOpen,
        open,
        close
      }}
    >
      {children}
    </ConnectWalletModalContext.Provider>
  );
};

export default ConnectWalletModalContext;
