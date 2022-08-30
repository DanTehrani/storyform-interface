import { Button } from "@chakra-ui/react";
import EthereumIcon from "./EthereumIcon";
import { useConnectWallet } from "../hooks";

const ConnectWalletButton = () => {
  const connect = useConnectWallet();

  return (
    <Button
      variant="outline"
      onClick={() => {
        connect();
      }}
      leftIcon={<EthereumIcon></EthereumIcon>}
    >
      Sign in
    </Button>
  );
};

export default ConnectWalletButton;
