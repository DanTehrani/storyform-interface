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
    ? [...JSON.parse(transactions), tx]
    : [tx];

  window.localStorage.setItem(
    "transactions",
    JSON.stringify(updatedTransactions)
  );
};
