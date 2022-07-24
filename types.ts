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

export type FormQuestion = {
  label: string;
  type: "text" | "select" | "radio";
  required?: boolean;
};

export type FormAnswer = {
  questionIndex: number;
  answer: string | number;
};
