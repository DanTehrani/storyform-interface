import { useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import { getSubmissions } from "./lib/formSubmission";
import {
  useSignTypedData,
  useProvider,
  useAccount,
  useSignMessage
} from "wagmi";
import {
  Form,
  FormSubmission,
  WagmiEIP712TypedMessage,
  FormSubmissionInput,
  FormUploadInput,
  PageInfo
} from "./types";
import { SIGNATURE_DATA_TYPES, SIGNATURE_DOMAIN } from "./config";
import axios from "./lib/axios";
import { getForm, getForms, getUserFormCount } from "./lib/form";
import { submitAnswer } from "./lib/formSubmission";
import ConnectWalletModalContext from "./contexts/ConnectWalletModalContext";
import { getFormUrl } from "./utils";
import { utils } from "ethers";
import { sha256 } from "ethers/lib/utils";

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

const first = 1;
export const useSubmissions = (
  formId: string | undefined
): {
  submissions: FormSubmission[];
  getNext: () => void;
  getPrevious: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [cursors, setCursors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    hasNextPage: false
  });

  useEffect(() => {
    (async () => {
      if (formId) {
        const result = await getSubmissions({
          formId,
          first
        });

        setSubmissions(result.submissions);
        setPageInfo(result.pageInfo);
        setCursors(result.cursors);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first, formId]);

  const getNext = useCallback(() => {
    (async () => {
      if (formId) {
        const result = await getSubmissions({
          formId,
          first,
          after: cursors[cursors.length - 1]
        });

        setCursors([...cursors, ...result.cursors]);
        setCurrentPage(currentPage + 1);
        setPageInfo(result.pageInfo);
        setSubmissions(result.submissions);
      }
    })();
  }, [currentPage, cursors, formId]);

  const getPrevious = useCallback(() => {
    (async () => {
      if (formId) {
        const result = await getSubmissions({
          formId,
          first,
          after: currentPage === 1 ? "" : cursors[currentPage * first - 1]
        });

        setCursors([...cursors, ...result.cursors]);
        setCurrentPage(currentPage - 1);
        setPageInfo(result.pageInfo);
        setSubmissions(result.submissions);
      }
    })();
  }, [currentPage, cursors, formId]);

  return {
    submissions,
    getNext,
    getPrevious,
    hasNextPage: pageInfo.hasNextPage,
    hasPreviousPage: currentPage !== 0
  };
};

export const useUploadForm = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const provider = useProvider({
    // @ts-ignore
    // NEXT_PUBLIC_CHAIN_ID is set to 5 (Goerli) in env.development
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)
  });

  const { signTypedDataAsync } = useSignTypedData();

  const uploadForm = async (form: FormUploadInput) => {
    setUploading(true);

    const eip712TypedMessage: WagmiEIP712TypedMessage = {
      domain: SIGNATURE_DOMAIN[provider.network.name],
      types: SIGNATURE_DATA_TYPES,
      value: form,
      primaryType: "Form"
    };

    let signature;
    try {
      signature = await signTypedDataAsync(eip712TypedMessage);
    } catch (err) {
      setUploading(false);
    }

    if (!signature) {
      return;
    }

    const formInput = {
      signature,
      eip712TypedMessage
    };

    await axios.post("/forms", formInput);
    setUploading(false);
    setUploadComplete(true); // TODO Change the name
  };

  return { uploading, uploadForm, uploadComplete };
};

export const useUserForms = (): Form[] | undefined => {
  const { address } = useAccount();
  const [forms, setForms] = useState<Form[] | undefined>();

  useEffect(() => {
    (async () => {
      if (address) {
        setForms(await getForms({ owner: address }));
      }
    })();
  }, [address]);

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

export const useConnectWallet = () => {
  const { open } = useContext(ConnectWalletModalContext);

  const connect = () => {
    open();
  };

  return connect;
};

export const useUserFormCount = () => {
  const [formCount, setFormCount] = useState<number>();
  const { address } = useAccount();
  useEffect(() => {
    (async () => {
      if (address) {
        setFormCount(await getUserFormCount(address));
      }
    })();
  }, [address]);

  return {
    formCount
  };
};

export const useSignSecretMessage = () => {
  const secretMessage = sha256(
    `0x${Buffer.from(Math.random().toString()).toString("hex")}`
  );

  const { signMessage: signSecretMessage, data } = useSignMessage({
    message: secretMessage
  });

  return { signSecretMessage, data, secretMessage };
};
