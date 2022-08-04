import { useState } from "react";
import { useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { getSubmissions } from "./lib/formSubmission";
import { useContract, useSignMessage, useProvider } from "wagmi";
import { CONTRACT_ADDRESS } from "./config";
import StormFormABI from "./abi/StoryForm.json";
import { Group } from "@semaphore-protocol/group";
import { poseidon } from "circomlibjs";
import { Identity } from "@semaphore-protocol/identity";
import { ethers } from "ethers";
import { FormSubmission } from "./types";

// Reference: https://react-redux.js.org/using-react-redux/usage-with-typescript
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const useStoryForm = () => {
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS.STORY_FORM.local,
    contractInterface: StormFormABI.abi,
    signerOrProvider: ethers.getDefaultProvider()
  });

  return contract;
};

export const useGroup = (groupId: number) => {
  const [group, setGroup] = useState<Group | null>();
  const provider = useProvider();

  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS.STORY_FORM.local,
    contractInterface: StormFormABI.abi,
    signerOrProvider: provider
  });

  useEffect(() => {
    (async () => {
      if (contract) {
        const events = await contract.queryFilter(
          contract.filters.MemberAdded(groupId)
        );

        const members = events.map(({ args }) => args[1].toString());
        const _group = new Group(16);
        _group.addMembers(members);
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
    return poseidon([await signMessageAsync()]);
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

export const useAddMember = () => {};

// formAnswersSlice alternative
export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const storyForm = useStoryForm();

  useEffect(() => {
    (async () => {
      const _submissions = await getSubmissions({ first: 10 });

      const submissionsWithVerificationLogs = _submissions.map(submission => ({
        verificationLog: storyForm.queryFilter(
          storyForm.filters.ProofVerified(submission.submissionId, null)
        ),
        ...submission
      }));

      setSubmissions(submissionsWithVerificationLogs);
    })();
  }, []);

  return submissions;
};
