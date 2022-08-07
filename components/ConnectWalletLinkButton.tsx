import { Link } from "@chakra-ui/react";
import EthereumIcon from "./EthereumIcon";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const ConnectWalletLinkButton = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector()
  });
  return (
    <>
      <Link
        onClick={() => {
          connect();
        }}
        textDecoration="underline"
      >
        ログイン
      </Link>
      <EthereumIcon></EthereumIcon>
    </>
  );
};

export default ConnectWalletLinkButton;
