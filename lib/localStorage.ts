import { LocalStorageTransaction } from "../types";

//export const signatureExists = () => {};

// export const getSignature = (): string | null => {};

export const getTransactionDataFromLocalStorage = (txId: string): string => {
  const transactions = window.localStorage.getItem("transactions");
  const data =
    transactions &&
    JSON.parse(transactions).find(
      (tx: LocalStorageTransaction) => tx.id === txId
    )?.bookmark;
  return data;
};

export const getTransactionIdsFromLocalStorage = (): string[] => {
  const transactions = window.localStorage.getItem("transactions");
  const transactionIds = transactions
    ? JSON.parse(transactions).map(({ id }: { id: string }) => id)
    : [];

  return transactionIds;
};

export const saveTransactionToLocalStorage = (tx: LocalStorageTransaction) => {
  const transactions = window.localStorage.getItem("transactions");
  const updatedTransactions = transactions
    ? [...JSON.parse(transactions), tx]
    : [tx];

  window.localStorage.setItem(
    "transactions",
    JSON.stringify(updatedTransactions)
  );
};
