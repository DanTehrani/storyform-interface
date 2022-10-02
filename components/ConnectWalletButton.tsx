import { Button } from "@chakra-ui/react";
import EthereumIcon from "./EthereumIcon";
import { useConnectWallet } from "../hooks";

type Props = {
  label?: string;
};

const ConnectWalletButton: React.FC<Props> = ({ label }) => {
  const connect = useConnectWallet();

  return (
    <Button
      variant="outline"
      onClick={() => {
        connect();
      }}
      leftIcon={<EthereumIcon></EthereumIcon>}
    >
      {label || "Sign in"}
    </Button>
  );
};

export default ConnectWalletButton;
