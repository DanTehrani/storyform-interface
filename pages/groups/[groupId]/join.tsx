import type { NextPage } from "next";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useGetIdentity } from "../../../hooks";

const JoinGroup: NextPage = () => {
  const getIdentity = useGetIdentity();
  const [identityCommitment, setIdentityCommitment] = useState<bigint | null>(
    null
  );

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
