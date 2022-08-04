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
  first,
  after
}: {
  first: number;
  after?: string;
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

          if (!data) {
            return null;
          }

          const { answers } = JSON.parse(data);

          return {
            txId: tx.id,
            formId: tx.tags.find(tag => tag.name === "Form-Id").value,
            answers: answers || [],
            submissionId: tx.tags.find(tag => tag.name === "Submission-Id")
              .value,
            arweaveTxStatus: transactionStatus.status
          };
        })().catch(err => err)
      )
    )
  ).filter(notEmpty);

  return submissions;
};
