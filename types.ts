export type FormCustomAttribute = {
  key: string;
  value: string;
};

export interface FormQuestion {
  label: string;
  type: string; // text, select, checkbox
  customAttributes: FormCustomAttribute[];
  required?: boolean;
  options?: string[];
  other?: boolean;
}

export type FormIdPreImage = {
  title: string;
  unixTime: number;
  questions: FormQuestion[];
  settings: FormSettings;
  owner: string;
  status: "active" | "deleted";
};

export type FormUploadInput = {
  id: string;
} & FormIdPreImage;

export type FormWithTxStatus = {
  txStatus: number;
  id?: string;
  title?: string;
  unixTime?: number;
  questions?: FormQuestion[];
  settings?: FormSettings;
  owner?: string;
  context?: FormContext;
  arweaveTxId: string;
};

export type Form = {
  id: string;
  title: string;
  unixTime: number;
  questions: FormQuestion[];
  settings: FormSettings;
  owner: string;
  context: FormContext;
  arweaveTxId: string;
};

export type FormContext = {
  groupId?: number;
  requireZkMembershipProof: boolean;
  requireSignature: boolean;
};

export type FormAnswer = {
  questionIndex: number;
  answer: string | number;
};

export type Submission = {
  answers: string[];
  formId: string[];
};

export type Proof = {
  proof: any;
  publicSignals: any;
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

export type FormSubmission = {
  formId: string;
  answers: string[];
  submissionId: string;
  txId: string;
  arweaveTxStatus: number;
  verificationTx: string;
  unixTime: number;
};

export type FormSubmissionInput = {
  formId: string;
  answers: string[];
  submissionId: string;
  membershipProof?: string;
  dataSubmissionProof?: string;
  unixTime: number;
};

export type ProofInputs = {
  secret: bigint;
  formId: bigint;
  submissionId: bigint;
};

export type Pagination = {
  first: number;
  after?: string;
};

export type FormJsonInput = {
  title: string;
  questions: FormQuestion[];
};

export type FormSettings = {
  requireEthereumWallet: boolean;
};

export type FormInput = {
  title: string;
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
  formInput: FormInput;
  setFormInput: (formInput: FormInput) => void;
  updateQuestion: (question: FormQuestion, questionIndex: number) => void;
  updateSettings: (settings: FormSettings) => void;
  getForm: (formId: string) => void;
  formNotFound: boolean;
  formUpdating: boolean;
}

export type ArweaveTxTag = {
  name: string;
  value: string;
};
export type ArweaveTx = {
  id: string;
  tags: ArweaveTxTag[];
};
