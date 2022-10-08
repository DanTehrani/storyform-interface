export interface FormQuestion {
  label: string;
  type: string; // text, select, checkbox
  required?: boolean;
  options?: string[];
  other?: boolean;
}

export type FormIdPreImage = {
  title: string;
  description: string;
  unixTime: number;
  questions: FormQuestion[];
  settings: FormSettings;
  owner: string;
  status: string;
  appId: string;
};

export type FormUploadInput = {
  id: string;
} & FormIdPreImage;

export type Form = {
  id: string;
  title: string;
  description: string;
  unixTime: number;
  questions: FormQuestion[];
  settings: FormSettings;
  owner: string;
  arweaveTxId: string;
  signatureValid?: boolean;
  status: string;
};

export type FormAnswer = {
  questionIndex: number;
  answer: string | number;
};

export type Submission = {
  answers: string[];
  formId: string;
};

export type WagmiEIP712TypedMessage = {
  domain: {
    [additionalProperties: string]: string;
  };
  types: {
    [additionalProperties: string]: {
      name: string;
      type: string;
    }[];
  };
  value: FormUploadInput;
  primaryType: string;
};

export type EIP712TypedMessage = {
  types: {
    EIP712Domain: {
      name: string;
      type: string;
    }[];
    [additionalProperties: string]: {
      name: string;
      type: string;
    }[];
  };
  message: FormUploadInput;
} & WagmiEIP712TypedMessage;

export enum ProofVerificationStatus {
  Verified,
  Invalid,
  Verifying,
  Nonexistent
}

export type FormSubmission = {
  formId: string;
  answers: string[];
  txId: string;
  membershipProof?: FullProof;
  attestationProof?: FullProof;
  proofsVerified: ProofVerificationStatus;
  unixTime: number;
};

export type FormSubmissionInput = {
  membershipProof?: FullProof;
  attestationProof?: FullProof;
  formId: string;
  answers?: string[] | string;
  unixTime: number;
  appId: string;
};

export type PageInfo = {
  hasNextPage: boolean;
};

export type FormSettings = {
  devcon6: boolean;
};

export type FormInput = {
  title: string;
  description: string;
  questions: FormQuestion[];
  settings: FormSettings;
};

export interface ICreateFormContext {
  formInput: FormInput;
  setFormInput: (formInput: FormInput) => void;
  updateQuestion: (question: FormQuestion, questionIndex: number) => void;
  updateSettings: (settings: FormSettings) => void;
}

export interface IEditFormContext {
  formInput: FormInput | null | undefined;
  setFormInput: (formInput: FormInput) => void;
  updateQuestion: (question: FormQuestion, questionIndex: number) => void;
  updateSettings: (settings: FormSettings) => void;
  getForm: (formId: string) => void;
  formNotFound: boolean;
  formOwner: string | null | undefined;
  formStatus: string | null | undefined;
}

export type ArweveGraphQLResult = {
  data: {
    transactions: {
      edges: {
        node: ArweaveTx[];
      }[];
    };
  };
};

export type ArweaveTxTag = {
  name: string;
  value: string;
};
export type ArweaveTx = {
  id: string;
  tags: ArweaveTxTag[];
};

export type FullProof = {
  proof: string;
  publicSignals: {
    [additionalProperties: string]: string;
  };
};

export type FullProveInput = {
  r: bigint[];
  s: bigint[];
  msghash: bigint[];
  pubkey: [bigint[], bigint[]];
  siblings: bigint[];
  pathIndices: number[];
  root: bigint;
};

export type AttestationProofInput = {
  secret: string;
  submission: Submission;
};
