import { Button } from "@chakra-ui/react";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

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
    >
      ウォレットに接続
    </Button>
  );
};

export default ConnectWalletButton;
