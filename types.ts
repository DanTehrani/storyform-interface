export type FormCustomAttribute = {
  key: string;
  value: string;
};

export interface FormQuestion {
  label: string;
  type: string;
  customerAttributes: FormCustomAttribute[];
  required?: boolean;
  options?: string[];
}

export type Form = {
  id: string;
  title: string;
  unixTime: number;
  questions: FormQuestion[];
  owner: string;
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

export type EIP721TypedMessage = {
  domain: {
    [additionalProperties: string]: string;
  };
  types: {
    [additionalProperties: string]: {
      name: string;
      type: string;
    }[];
  };
  value: {
    title: string;
    unixTime: number;
    questions: string;
    owner: string;
  };
};

export type FormInput = {
  signature: string;
  eip712TypedMessage: EIP721TypedMessage;
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
  membershipProof: string;
  dataSubmissionProof: string;
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
