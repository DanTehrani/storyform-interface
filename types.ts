export type Bookmark = {
  arweveTxId: string;
  title: string;
  url: string;
};

export type BookmarkInput = {
  url: string;
};

export type LocalStorageTransaction = {
  id: string;
  url: string;
};

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
