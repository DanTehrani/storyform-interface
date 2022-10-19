import { useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import { getSubmissions, getSubmission } from "./lib/formSubmission";
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
  PageInfo,
  FullProof,
  ProofVerificationStatus
} from "./types";
import { SIGNATURE_DATA_TYPES, SIGNATURE_DOMAIN } from "./config";
import axios from "./lib/axios";
import { getForm, getForms, getUserFormCount } from "./lib/form";
import { submitAnswer } from "./lib/formSubmission";
import ConnectWalletModalContext from "./contexts/ConnectWalletModalContext";
import { verifyFormSubmission } from "./lib/zkUtils";

export const useForm = (formId: string) => {
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

const first = 10;
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
        // Verify proofs of submissions
        setPageInfo(result.pageInfo);
        setCursors(result.cursors);

        const submissionsWithVerifications: FormSubmission[] = [];
        for (const submission of result.submissions) {
          if (!submission.attestationProof || !submission.membershipProof) {
            submissionsWithVerifications.push({
              ...submission,
              proofsVerified: ProofVerificationStatus.Nonexistent
            });
          } else {
            const verified = await verifyFormSubmission(
              submission as FormSubmission & {
                membershipProof: FullProof;
                attestationProof: FullProof;
              }
            );
            submissionsWithVerifications.push({
              ...submission,
              proofsVerified: verified
                ? ProofVerificationStatus.Verified
                : ProofVerificationStatus.Invalid
            });
          }
        }

        setSubmissions(submissionsWithVerifications);
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

export const useSubmission = (txId: string) => {
  const [submission, setSubmission] = useState<FormSubmission>();

  useEffect(() => {
    (async () => {
      if (txId) {
        const submission = await getSubmission(txId);

        setSubmission(submission);

        if (submission.attestationProof && submission.membershipProof) {
          const verified = await verifyFormSubmission(
            submission as FormSubmission & {
              membershipProof: FullProof;
              attestationProof: FullProof;
            }
          );

          setSubmission({
            ...submission,
            proofsVerified: verified
              ? ProofVerificationStatus.Verified
              : ProofVerificationStatus.Invalid
          });
        } else {
          setSubmission({
            ...submission,
            proofsVerified: ProofVerificationStatus.Nonexistent
          });
        }
      }
    })();
  }, [txId]);

  return { submission };
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
  const [txId, setTxId] = useState<string | null>();

  const submitForm = async (formSubmission: FormSubmissionInput) => {
    setSubmittingForm(true);
    const _txId = await submitAnswer(formSubmission);
    setTxId(_txId);

    setSubmittingForm(false);
    setSubmissionComplete(true);
  };

  return {
    submittingForm,
    submitForm,
    submissionComplete,
    txId
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
  const {
    data,
    signMessageAsync: signSecretMessage,
    variables
  } = useSignMessage({});

  return { signSecretMessage, data, secretMessage: variables?.message };
};

// Generate a 31byte (compatible with bn254) random value
const getRandomValue = () => {
  const buf = new Uint8Array(31);
  window.crypto.getRandomValues(buf);
  return BigInt("0x" + Buffer.from(buf).toString("hex"));
};

export const useAttestationPreImage = () => {
  const [attestationPreImage, setAttestationPreImage] = useState<
    bigint | undefined
  >();

  useEffect(() => {
    setAttestationPreImage(getRandomValue());
  }, []);

  return { attestationPreImage };
};
