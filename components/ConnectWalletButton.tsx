import { Button } from "@chakra-ui/react";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import EthereumIcon from "./EthereumIcon";

const ConnectWalletButton = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector()
  });

  return (
    <Button
      variant="outline"
      onClick={() => {
        connect();
      }}
      leftIcon={<EthereumIcon></EthereumIcon>}
    >
      ログイン
    </Button>
  );
};

export default ConnectWalletButton;
