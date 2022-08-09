import { Button, useTab } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import EthereumIcon from "./EthereumIcon";

const ConnectWalletButton = () => {
  const { t } = useTranslation();
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
      {t("login")}
    </Button>
  );
};

export default ConnectWalletButton;
