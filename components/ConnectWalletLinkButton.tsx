import { Link } from "@chakra-ui/react";
import EthereumIcon from "./EthereumIcon";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import useTranslation from "next-translate/useTranslation";

const ConnectWalletLinkButton = () => {
  const { t } = useTranslation();
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
        {t("login")}
      </Link>
      <EthereumIcon></EthereumIcon>
    </>
  );
};

export default ConnectWalletLinkButton;
