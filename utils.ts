import { Form } from "./types";

export const notEmpty = (value: any): boolean =>
  value === null || value === undefined ? false : true;

export const formSchemeValid = (form: Form): boolean =>
  notEmpty(form.id) &&
  notEmpty(form.owner) &&
  notEmpty(form.title) &&
  notEmpty(form.version) &&
  notEmpty(form.questions) &&
  typeof form.questions !== "string";

export const getTxArweaveExplorerUrl = (txId: string) =>
  `https://viewblock.io/arweave/tx/${txId}`;

export const getEtherscanLogPageUrl = (txId: string, network: string) =>
  `https://${network}.etherscan.io/tx/${txId}#eventlog`;

export const getShortenId = (id: string) =>
  `${id.slice(0, 3)}...${id.slice(6, 9)}`;
