import { LocalStorageTransaction } from "../types";

//export const signatureExists = () => {};

// export const getSignature = (): string | null => {};

export const getTransactionsFromLocalStorage =
  (): LocalStorageTransaction[] => {
    const transactions = window.localStorage.getItem("transactions");

    return transactions ? JSON.parse(transactions) : [];
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
    ? [tx, ...JSON.parse(transactions)]
    : [tx];

  window.localStorage.setItem(
    "transactions",
    JSON.stringify(updatedTransactions)
  );
};

export const removeTransactionsFromLocalStorage = (txIds: string[]) => {
  const transactions = window.localStorage.getItem("transactions");

  if (!transactions) {
    // Likely local storage was cleared
    return;
  }

  const updatedTransactions = JSON.parse(transactions).filter(
    (tx: LocalStorageTransaction) => !txIds.includes(tx.id)
  );

  window.localStorage.setItem(
    "transactions",
    JSON.stringify(updatedTransactions)
  );
};
