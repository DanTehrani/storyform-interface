import { Link } from "@chakra-ui/react";
import EthereumIcon from "./EthereumIcon";
import { useConnectWallet } from "../hooks";

const ConnectWalletLinkButton = () => {
  const connect = useConnectWallet();

  return (
    <>
      <Link
        onClick={() => {
          connect();
        }}
        textDecoration="underline"
      >
        Login
      </Link>
      <EthereumIcon></EthereumIcon>
    </>
  );
};

export default ConnectWalletLinkButton;
