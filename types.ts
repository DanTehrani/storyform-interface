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
  status: string;
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
  submissionId?: string;
  txId: string;
  verificationTx?: string;
  unixTime: number;
};

export type FormSubmissionInput = {
  formId: string;
  answers?: string[] | string;
  submissionId?: string;
  membershipProof?: string;
  dataSubmissionProof?: string;
  unixTime: number;
  appId: string;
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

export type FormSettings = {
  respondentCriteria: string;
  encryptAnswers: boolean;
  encryptionPubKey?: string;
  erc721TokenAddress?: string;
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
}

export type ArweaveTxTag = {
  name: string;
  value: string;
};
export type ArweaveTx = {
  id: string;
  tags: ArweaveTxTag[];
};
