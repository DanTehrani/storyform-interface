import axios from "./axios";
import arweaveGraphQl from "./arweaveGraphQl";
import arweave from "./arweave";
import { FormSubmission, FormSubmissionInput } from "../types";
import { gql } from "@apollo/client";
import { APP_ID } from "../config";

export const submitAnswer = async (submission: FormSubmissionInput) => {
  const res = await axios.post(`/answers`, submission);
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
          values: ["submission"],
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

  const transactions = result.data.transactions.edges.map(({ node }) => node);

  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    if (value === null || value === undefined) return false;
    return true;
  }

  const submissions: FormSubmission[] = (
    await Promise.all(
      transactions.map(tx =>
        (async (): Promise<FormSubmission | null> => {
          let data: string | null;
          try {
            data = (
              await arweave.transactions.getData(tx.id, {
                decode: true,
                string: true
              })
            ).toString();
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            data = null;
          }

          const transactionStatus = await arweave.transactions.getStatus(tx.id);

          const submissionId = tx.tags.find(
            tag => tag.name === "Submission-Id"
          ).value;

          const verificationLogs = await storyForm.queryFilter(
            storyForm.filters.ProofVerified(submissionId, null)
          );

          const verificationTx =
            verificationLogs?.length && verificationLogs[0];

          return {
            txId: tx.id,
            formId: tx.tags.find(tag => tag.name === "Form-Id").value,
            answers: (data && JSON.parse(data).answers) || [],
            submissionId,
            arweaveTxStatus: transactionStatus.status,
            verificationTx: verificationTx?.transactionHash
          };
        })().catch(err => err)
      )
    )
  ).filter(notEmpty);

  return submissions;
};
