import { useContext } from "react";
import type { NextPage } from "next";
import { Container, Button, useToast } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import ProverContext from "../contexts/ProverContext";
import ConnectWalletButton from "../components/ConnectWalletButton";

const Bench: NextPage = () => {
  const account = useAccount();
  const { address } = account;
  const toast = useToast();
  const prover = useContext(ProverContext);

  return (
    <Container mt={10} maxW={[850]} mb={200}>
      <ConnectWalletButton></ConnectWalletButton>
      <Button onClick={prover.generateMembershipProofInBg}>
        Verify sig & Get address
      </Button>
    </Container>
  );
};

export default Bench;
