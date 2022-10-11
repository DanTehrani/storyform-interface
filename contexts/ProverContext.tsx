import { useState } from "react";
import { createContext } from "react";
import { FullProof, Submission } from "../types";
import { useAccount, useSignMessage } from "wagmi";
import * as prover from "../lib/prover";

interface IProverContext {
  isBgProvingMembership: boolean;
  isGeneratingAttestationProof: boolean;
  generateMembershipProofInBg: () => void;
  generateAttestationProof: (submission: Submission) => void;
  membershipProof: FullProof | null;
  attestationProof: FullProof | null;
}

const defaultState = {
  isBgProvingMembership: false,
  fullProof: null,
  membershipProof: null,
  attestationProof: null
};

// @ts-ignore
const ProverContext = createContext<IProverContext>(defaultState);

export const ProverContextProvider = ({ children }) => {
  const [isBgProvingMembership, setIsBgProvingMembership] =
    useState<boolean>(false);
  const [isGeneratingAttestationProof, setIsGeneratingAttestationProof] =
    useState<boolean>(false);

  const [membershipProof, setMembershipProof] = useState<FullProof | null>(
    null
  );
  const [attestationProof, setAttestationProof] = useState<FullProof | null>(
    null
  );
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const generateMembershipProofInBg = async () => {
    if (address) {
      // Prompt user to sign the message
      const message = "storyform_dev";

      const signature = await signMessageAsync({
        message
      });

      prover.generateMembershipProofInBg({
        address,
        signature,
        message,
        callback: _membershipProof => {
          setMembershipProof(_membershipProof);
          setIsBgProvingMembership(false);
        }
      });

      setIsBgProvingMembership(true);
    }
  };

  const generateAttestationProof = async (submission: Submission) => {
    setIsGeneratingAttestationProof(true);
    const _attestationProof = await prover.generateSubmissionAttestationProof({
      secret: "", // TODO: Make this a secret message
      submission
    });
    setIsGeneratingAttestationProof(false);
    setAttestationProof(_attestationProof);
  };

  return (
    <ProverContext.Provider
      value={{
        isGeneratingAttestationProof,
        isBgProvingMembership,
        attestationProof,
        membershipProof,
        generateAttestationProof,
        generateMembershipProofInBg
      }}
    >
      {children}
    </ProverContext.Provider>
  );
};

export default ProverContext;
