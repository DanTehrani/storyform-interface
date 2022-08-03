import { useState } from "react";
import { useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { getSubmissions } from "./lib/formSubmission";
import {
  useContract,
  useContractWrite,
  useSignMessage,
  usePrepareContractWrite
} from "wagmi";
import { CONTRACT_ADDRESS, SIGNATURE_DOMAIN } from "./config";
import StormFormABI from "./abi/StoryForm.json";
import SemaphoreABI from "./abi/Semaphore.json";
import { Group } from "@semaphore-protocol/group";
import { poseidon } from "circomlibjs";
import { Identity } from "@semaphore-protocol/identity";
import { ethers } from "ethers";

// Reference: https://react-redux.js.org/using-react-redux/usage-with-typescript
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGroup = (groupId: number) => {
  const [group, setGroup] = useState<Group | null>();

  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS.SEMAPHORE.local,
    contractInterface: SemaphoreABI.abi,
    signerOrProvider: ethers.getDefaultProvider()
  });

  useEffect(() => {
    (async () => {
      if (contract) {
        const events = await contract.queryFilter(
          contract.filters.MemberAdded()
        );

        const _group = new Group();
        //        _group.addMembers(members.map(m => m));
        setGroup(_group);
      }
    })();
  }, []);

  return { group };
};

export const useGetIdentitySecret = () => {
  const { signMessageAsync } = useSignMessage({
    message: "Keep this secret safe"
  });

  const getIdentitySecret = async () => {
    return await signMessageAsync();
  };

  return getIdentitySecret;
};

export const useGetIdentity = () => {
  const getIdentitySecret = useGetIdentitySecret();

  const getIdentity = async () => {
    const secret = await getIdentitySecret();
    const identity = new Identity(secret);
    return identity;
  };

  return getIdentity;
};

export const useAddMember = () => {
  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS.SEMAPHORE.local,
    contractInterface: SemaphoreABI.abi,
    functionName: "addMembers"
  });
  return useContractWrite(config);
};
