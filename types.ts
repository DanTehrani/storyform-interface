import type { MerkleProof } from "@zk-kit/incremental-merkle-tree";

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
  id?: string;
  title: string;
  version: string;
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
    EIP712Domain: {
      name: string;
      type: string;
    }[];
    [additionalProperties: string]: {
      name: string;
      type: string;
    }[];
  };
  primaryType: string;
  message: Form;
};

export type FormInput = {
  signature: string;
  eip721TypedMessage: EIP721TypedMessage;
};

export type FormSubmission = {
  formId: string;
  answers: string[];
  submissionId: string;
  txId: string;
};

export type FormSubmissionInput = {
  formId: string;
  answers: string[];
  submissionId: string;
  membershipProof: string;
  dataSubmissionProof: string;
};

export type ProofInputs = {
  secret: bigint;
  formId: bigint;
  submissionId: bigint;
};
