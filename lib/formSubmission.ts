import axios from "./axios";
import arweaveGraphQl from "./arweaveGraphQl";
import { FormSubmission, FormSubmissionInput } from "../types";
import { gql } from "@apollo/client";
import { APP_ID } from "../config";
import {
  notEmpty,
  formSubmissionSchemeValid,
  getArweaveTxTagValue,
  getLatestByTagValue,
  getArweaveTxData
} from "../utils";

export const submitAnswer = async (submission: FormSubmissionInput) => {
  await axios.post(`/answers`, submission);
};

export const getSubmissions = async ({
  formId,
  first,
  after,
  storyForm
}: {
  formId: string;
  first: number;
  after?: string;
  storyForm: any;
}) => {
  const result = await arweaveGraphQl.query({
    query: gql`
      query transactions($first: Int!, $after: String, $tags: [TagFilter!]) {
        transactions(first: $first, after: $after, tags: $tags) {
          edges {
            node {
              id
              tags {
                value
                name
              }
            }
          }
        }
      }
    `,
    variables: {
      first,
      after,
      tags: [
        {
          name: "App-Id",
          values: [APP_ID],
          op: "EQ"
        },
        {
          name: "Type",
          values: ["Submission", "submission"],
          op: "EQ"
        },
        {
          name: "Form-Id",
          values: [formId],
          op: "EQ"
        }
      ]
    }
  });

  //  const transactions = getLatestByTagValue(result, "Submission-Id");
  const transactions = result.data.transactions.edges.map(({ node }) => node);

  const submissions: FormSubmission[] = (
    await Promise.all(
      transactions.map(tx =>
        (async (): Promise<FormSubmission | null> => {
          let data: FormSubmission | null;
          try {
            data = await getArweaveTxData(tx.id);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            data = null;
          }

          /*
          const submissionId = getArweaveTxTagValue(tx, "Submission-Id");

          const verificationLogs = await storyForm.queryFilter(
            storyForm.filters.ProofVerified(submissionId, null)
          );

          const verificationTx =
            verificationLogs?.length && verificationLogs[0];
          */

          return {
            txId: tx.id,
            formId: getArweaveTxTagValue(tx, "Form-Id"),
            answers: data?.answers || [],
            // submissionId,
            //            verificationTx: verificationTx?.transactionHash,
            unixTime: parseInt(getArweaveTxTagValue(tx, "Unix-Time"))
          };
        })().catch(err => err)
      )
    )
  )
    .filter(notEmpty)
    .filter(formSubmissionSchemeValid);

  return submissions;
};

export const getDecryptedSubmissions = async ({
  formId,
  first,
  after,
  storyForm,
  privKey
}: {
  formId: string;
  first: number;
  after?: string;
  storyForm: any;
  privKey: string;
}) => {
  const submissions = await getSubmissions({
    formId,
    first,
    after,
    storyForm
  });

  // TODO: Decrypt answers and return
};
