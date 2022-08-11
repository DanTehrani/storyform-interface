import { Button } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import EthereumIcon from "./EthereumIcon";
import { useConnectWallet } from "../hooks";

const ConnectWalletButton = () => {
  const { t } = useTranslation("common");
  const connect = useConnectWallet();

  return (
    <Button
      variant="outline"
      onClick={() => {
        connect();
      }}
      leftIcon={<EthereumIcon></EthereumIcon>}
    >
      {t("login")}
    </Button>
  );
};

export default ConnectWalletButton;
