import { Form } from "../types";

export const notEmpty = (value: any): boolean =>
  value === null || value === undefined ? false : true;

export const formSchemeValid = (form: Form): boolean =>
  notEmpty(form.id) &&
  notEmpty(form.owner) &&
  notEmpty(form.title) &&
  notEmpty(form.version) &&
  notEmpty(form.questions);

export const getTxArweaveExplorerUrl = (txId: string) =>
  `https://viewblock.io/arweave/tx/${txId}`;

const etherscanLogPageUrl = (txId: string) =>
  `https://etherscan.io/tx/${txId}#eventlog`;
