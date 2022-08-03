import { useState } from "react";
import { Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import { CONTRACT_ADDRESS } from "../../../config";
import { useGetIdentity, useAddMember } from ".../../../hooks";
import { usePrepareContractWrite } from "wagmi";
import SemaphoreABI from ".../../../abi/Semaphore.json";

const JoinGroup: NextPage = () => {
  const getIdentity = useGetIdentity();
  const { data, writeAsync: addMember } = useAddMember();
  const [identityCommitment, setIdentityCommitment] = useState<bigint | null>(
    null
  );

  const { config, refetch } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS.SEMAPHORE.local,
    contractInterface: SemaphoreABI.abi,
    functionName: "addMembers",
    args: [0, identityCommitment]
  });

  const handleJoinClick = async () => {
    const identity = await getIdentity();
    const _identityCommitment = identity.generateCommitment();

    setIdentityCommitment(_identityCommitment);

    /*
    if (addMember && identityCommitment) {
      await addMember(0, identityCommitment);
    }
    */
  };

  return <Button onClick={handleJoinClick}></Button>;
};

export default JoinGroup;
