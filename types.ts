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
