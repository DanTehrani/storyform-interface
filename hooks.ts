import { useState } from "react";
import { useEffect } from "react";
import { getSubmissions } from "./lib/formSubmission";
import {
  useContract,
  useSignMessage,
  useSignTypedData,
  useProvider
} from "wagmi";
import { STORY_FORM_ADDRESS } from "./config";
import StormFormABI from "./abi/StoryForm.json";
import { Group } from "@semaphore-protocol/group";
import { poseidon } from "circomlibjs";
import { Identity } from "@semaphore-protocol/identity";
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
const {
  generateProof: generateSemaphoreMembershipProof
} = require("@semaphore-protocol/proof");
import { groth16Prove as generateDataSubmissionProof } from "./lib/zksnark";

const useStoryForm = () => {
  const provider = useProvider();
  const contract = useContract({
    addressOrName: STORY_FORM_ADDRESS[provider.network.name],
    contractInterface: StormFormABI.abi,
    signerOrProvider: provider
  });

  return contract;
};

export const useJoinGroup = (groupId: number) => {
  // Post to gateway
};

export const useGroup = (groupId: number) => {
  const [group, setGroup] = useState<Group | null>();

  const storyForm = useStoryForm();

  useEffect(() => {
    (async () => {
      if (storyForm) {
        const events = await storyForm.queryFilter(
          storyForm.filters.MemberAdded(groupId)
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
  const provider = useProvider();
  const { signTypedDataAsync } = useSignTypedData();

  const uploadForm = async form => {
    const eip712TypedMessage: EIP721TypedMessage = {
      domain: SIGNATURE_DOMAIN[provider.network.name],
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
const sleep = ms => new Promise(r => setTimeout(r, ms));

export const useSubmitForm = () => {
  const [submittingForm, setSubmittingForm] = useState<boolean>(false);
  const [submissionComplete, setSubmissionComplete] = useState<boolean>(false);
  const submitForm = async (formSubmission: FormSubmissionInput) => {
    setSubmittingForm(true);
    //    await submitAnswer(formSubmission);
    await sleep(3000);

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

export const useGenerateProof = () => {
  const [generatingProof, setGeneratingProof] = useState<boolean>(false);
  const getIdentitySecret = useGetIdentitySecret();

  const generateProof = async (formId, group) => {
    setGeneratingProof(true);
    const secret = await getIdentitySecret();
    const semaphoreIdentity = new Identity(secret.toString());

    // Reference: https://github.com/semaphore-protocol/boilerplate/blob/450248d33406a31b16f987c655cbe07a2ee9873d/apps/web-app/src/components/ProofStep.tsx#L48
    const externalNullifier = BigInt(1); // Group Id
    const signal = "0";

    // Re-construct group from on-chain data.
    const membershipFullProof = await generateSemaphoreMembershipProof(
      semaphoreIdentity,
      group,
      externalNullifier,
      signal,
      {
        wasmFilePath: "/semaphore.wasm",
        zkeyFilePath: "/semaphore.zkey"
      }
    );

    const secretBI = BigInt(secret);
    const formIdBI = BigInt(`0x${formId.slice(2)}`);
    const submissionId = poseidon([secretBI, formIdBI]);

    const dataSubmissionFullProof = await generateDataSubmissionProof({
      secret: secretBI,
      formId: formIdBI,
      submissionId
    });

    setGeneratingProof(false);

    return {
      submissionId,
      dataSubmissionFullProof,
      membershipFullProof
    };
  };

  return { generatingProof, generateProof };
};
