import { Link } from "@chakra-ui/react";
import EthereumIcon from "./EthereumIcon";
import { useConnectWallet } from "../hooks";
import useTranslation from "next-translate/useTranslation";

const ConnectWalletLinkButton = () => {
  const { t } = useTranslation("common");
  const connect = useConnectWallet();

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
