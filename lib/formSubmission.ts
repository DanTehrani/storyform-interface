import axios from "./axios";
import arweaveGraphQl from "./arweaveGraphQl";
import {
  FormSubmission,
  FormSubmissionInput,
  PageInfo,
  ProofVerificationStatus
} from "../types";
import { gql } from "@apollo/client";
import { APP_ID } from "../config";
import {
  notEmpty,
  formSubmissionSchemeValid,
  getArweaveTxTagValue,
  getArweaveTxData
} from "../utils";

export const submitAnswer = async (submission: FormSubmissionInput) => {
  await axios.post(`/answers`, submission);
};

export const getSubmissions = async ({
  formId,
  first,
  after
}: {
  formId: string;
  first: number;
  after?: string;
}): Promise<{
  submissions: FormSubmission[];
  cursors: string[];
  pageInfo: PageInfo;
}> => {
  const result = await arweaveGraphQl.query({
    query: gql`
      query transactions($first: Int!, $after: String, $tags: [TagFilter!]) {
        transactions(first: $first, after: $after, tags: $tags) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
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
          values: ["Submission"],
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

          return {
            txId: tx.id,
            formId: getArweaveTxTagValue(tx, "Form-Id"),
            answers: data?.answers || [],
            membershipProof: data?.membershipProof,
            attestationProof: data?.attestationProof,
            unixTime: parseInt(getArweaveTxTagValue(tx, "Unix-Time")),
            proofsVerified: ProofVerificationStatus.Verifying
          };
        })().catch(err => err)
      )
    )
  )
    .filter(notEmpty)
    .filter(formSubmissionSchemeValid);

  return {
    submissions,
    cursors: result.data.transactions.edges.map(({ cursor }) => cursor),
    pageInfo: result.data.transactions.pageInfo
  };
};
