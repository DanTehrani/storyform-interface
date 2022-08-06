import { useState } from "react";
import { useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { getSubmissions } from "./lib/formSubmission";
import { getDefaultProvider } from "ethers";
import { useContract, useSignMessage, useSignTypedData } from "wagmi";
import { CONTRACT_ADDRESS } from "./config";
import StormFormABI from "./abi/StoryForm.json";
import { Group } from "@semaphore-protocol/group";
import { poseidon } from "circomlibjs";
import { Identity } from "@semaphore-protocol/identity";
import { ethers } from "ethers";
import {
  Form,
  FormInput,
  FormSubmission,
  EIP721TypedMessage,
  Pagination,
  FormSubmissionInput
} from "./types";
import { SIGNATURE_DATA_TYPES, SIGNATURE_DOMAIN } from "./config";
import axios from "./lib/axios";
import { getForm, getForms } from "./lib/form";
import { submitAnswer } from "./lib/formSubmission";

// Reference: https://react-redux.js.org/using-react-redux/usage-with-typescript
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const useStoryForm = () => {
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS.STORY_FORM.local,
    contractInterface: StormFormABI.abi,
    signerOrProvider: ethers.getDefaultProvider("http://localhost:8545")
  });

  return contract;
};

export const useGroup = (groupId: number) => {
  const [group, setGroup] = useState<Group | null>();
  const provider = getDefaultProvider("http://localhost:8545");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export const useForm = (formId: string | undefined) => {
  const [form, setForm] = useState<Form | null>();
  const [formNotFound, setFormNotFound] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (formId) {
        const _form = await getForm(formId);
        if (!_form) {
          setFormNotFound(true);
        } else {
          setForm(_form);
        }
      }
    })();
  }, [formId]);

  return { form, formNotFound };
};

// formAnswersSlice alternative
export const useSubmissions = (
  formId: string | undefined,
  pagination: Pagination
) => {
  const { first, after } = pagination;
  const [submissions, setSubmissions] = useState<FormSubmission[] | null>();
  const storyForm = useStoryForm();

  useEffect(() => {
    (async () => {
      if (formId) {
        setSubmissions(
          await getSubmissions({
            formId,
            first,
            after,
            storyForm
          })
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [after, first, formId]);

  return submissions;
};

export const useUploadForm = () => {
  const { signTypedDataAsync } = useSignTypedData();

  const uploadForm = async form => {
    const eip712TypedMessage: EIP721TypedMessage = {
      domain: SIGNATURE_DOMAIN,
      types: SIGNATURE_DATA_TYPES,
      value: form
    };

    const signature = await signTypedDataAsync(eip712TypedMessage);

    const formInput: FormInput = {
      signature,
      eip712TypedMessage
    };

    await axios.post("/forms", formInput);
  };

  return uploadForm;
};

export const useForms = (pagination: Pagination): Form[] | undefined => {
  const [forms, setForms] = useState<Form[] | undefined>();

  useEffect(() => {
    (async () => {
      if (pagination) {
        setForms(await getForms(pagination));
      }
    })();
  }, [pagination]);

  return forms;
};

export const useSubmitForm = () => {
  const [submittingForm, setSubmittingForm] = useState<boolean>(false);
  const [submissionComplete, setSubmissionComplete] = useState<boolean>(false);
  const submitForm = async (formSubmission: FormSubmissionInput) => {
    setSubmittingForm(true);
    await submitAnswer(formSubmission);

    setSubmittingForm(false);
    setSubmissionComplete(true);
  };

  return {
    submittingForm,
    submitForm,
    submissionComplete
  };
};

export const usePagination = (
  initPagination: Pagination = {
    first: 10,
    after: ""
  }
): {
  pagination: Pagination;
  setPagination: (_pagination: Pagination) => void;
} => {
  const [pagination, setPagination] = useState(initPagination);

  return {
    pagination,
    setPagination
  };
};
