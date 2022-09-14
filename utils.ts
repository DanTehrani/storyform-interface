import {
  FormSubmission,
  FormIdPreImage,
  ArweaveTx,
  ArweveGraphQLResult
} from "./types";
const { NEXT_PUBLIC_CHAIN_ID } = process.env;
import { sha256 } from "ethers/lib/utils";
import axios from "axios";

export const notEmpty = <T>(value: T): boolean =>
  value === null || value === undefined ? false : true;

export const formSubmissionSchemeValid = (
  formSubmission: FormSubmission
): boolean =>
  notEmpty(formSubmission.formId) &&
  notEmpty(formSubmission.unixTime) &&
  typeof formSubmission.answers !== "string";

export const getTxArweaveExplorerUrl = (txId: string) =>
  `https://viewblock.io/arweave/tx/${txId}`;

export const getShortenId = (id: string) =>
  `${id.slice(0, 3)}...${id.slice(6, 9)}`;

export const getCurrentUnixTime = () => Math.floor(new Date().getTime() / 1000);

export const getArweaveTxTagValue = (tx, tagName): string =>
  tx.tags.find(({ name }) => tagName === name).value;

export const getArweaveTxUnixTime = (tx): number =>
  parseInt(getArweaveTxTagValue(tx, "Unix-Time"));

export const getNetworkNameFromChainId = (chainId: number): string => {
  switch (chainId) {
    case 5:
      return "goerli";
    default:
      return "";
  }
};

export const getEtherscanUrl = (id: string) =>
  NEXT_PUBLIC_CHAIN_ID &&
  `https://${getNetworkNameFromChainId(
    parseInt(NEXT_PUBLIC_CHAIN_ID)
  )}.etherscan.io/search?q=${id}`;

export const getFormIdFromForm = (form: FormIdPreImage): string =>
  sha256(new TextEncoder().encode(JSON.stringify(form)));

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getFormUrl = (formId: string) =>
  `${window.location.origin}/forms/${formId}`;

export const getFormResponsesUrl = (formId: string) =>
  `${window.location.origin}/forms/${formId}/submissions`;

export const getArweaveTxData = async (txId: string) => {
  const result = await axios.get(`https://arweave.net/${txId}`);
  const data = result.data;

  return data;
};

export const getNodesFromArweaveGraphQLResult = (
  result: ArweveGraphQLResult
): ArweaveTx[] => result.data.transactions.edges.map(({ node }) => node).flat();

export const removeDuplicates = <T>(array: T[]) => [...new Set(array)];
