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
  surveyId: string[];
};

export type Proof = {
  proof: any;
  publicSignals: any;
};
