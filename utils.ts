import { Form, FormSubmission } from "./types";
import type { ApolloQueryResult } from "@apollo/client";

export const notEmpty = (value: any): boolean =>
  value === null || value === undefined ? false : true;

export const formSchemeValid = (form: Form): boolean =>
  notEmpty(form.id) &&
  notEmpty(form.owner) &&
  notEmpty(form.title) &&
  notEmpty(form.unixTime) &&
  notEmpty(form.questions) &&
  typeof form.questions !== "string";

export const formSubmissionSchemeValid = (
  formSubmission: FormSubmission
): boolean =>
  notEmpty(formSubmission.submissionId) &&
  notEmpty(formSubmission.formId) &&
  notEmpty(formSubmission.unixTime) &&
  typeof formSubmission.answers !== "string";

export const getTxArweaveExplorerUrl = (txId: string) =>
  `https://viewblock.io/arweave/tx/${txId}`;

export const getEtherscanLogPageUrl = (txId: string) =>
  `https://goerli.etherscan.io/tx/${txId}#eventlog`;

export const getEtherscanUrl = (id: string) =>
  `https://goerli.etherscan.io/search?q=${id}`;

export const getShortenId = (id: string) =>
  `${id.slice(0, 3)}...${id.slice(6, 9)}`;

export const getCurrentUnixTime = () => Math.floor(new Date().getTime() / 1000);

export const getArweaveTxTagValue = (tx, tagName): string =>
  tx.tags.find(({ name }) => tagName === name).value;

export const getArweaveTxUnixTime = (tx): number =>
  parseInt(getArweaveTxTagValue(tx, "Unix-Time"));

export const getLatestByTagValue = (result: ApolloQueryResult<any>, tagName) =>
  result.data.transactions.edges
    .map(({ node }) => node)
    // Filter out transactions without the Unix-Time tag, by try extracting the tag.
    .filter(tx => {
      try {
        getArweaveTxUnixTime(tx);
        return true;
      } catch (err) {
        return false;
      }
    })
    // Sort transactions is descending order re: timestamp
    .sort((tx1, tx2) => getArweaveTxUnixTime(tx2) - getArweaveTxUnixTime(tx1))
    // Only return the latest version of the transaction
    .filter(
      (tx, i, self) =>
        self.findIndex(
          _tx =>
            getArweaveTxTagValue(_tx, tagName) ===
            getArweaveTxTagValue(tx, tagName)
        ) === i
    );