import { Form, Pagination } from "../types";
import arweaveGraphQl from "../lib/arweaveGraphQl";
import arweave from "./arweave";
import { gql } from "@apollo/client";
import { APP_ID } from "../config";
import {
  notEmpty,
  formSchemeValid,
  getArweaveTxTagValue,
  getLatestByTagValue
} from "../utils";

export const getForm = async (formId: string): Promise<Form | null> => {
  // sort is HEIGHT_DESC by default
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
      first: 1,
      tags: [
        {
          name: "App-Id",
          values: [APP_ID],
          op: "EQ"
        },
        {
          name: "Form-Id",
          values: [formId],
          op: "EQ"
        },
        {
          name: "Type",
          values: ["Form"],
          op: "EQ"
        }
      ]
    }
  });

  const txId = result.data.transactions.edges[0]?.node?.id;
  if (!txId) {
    return null;
  }

  let data;
  try {
    data = (
      await arweave.transactions.getData(txId, {
        decode: true,
        string: true
      })
    ).toString();
  } catch (err) {
    ///
  }

  // TODO: Filter out data with invalid format

  const form = data
    ? {
        ...JSON.parse(data),
        arweaveTxId: txId
      }
    : null;

  return form;
};

export const getForms = async ({
  first,
  after,
  owner
}: Pagination & {
  owner?: string;
  // TODO Return last  and first cursor
}): Promise<Form[]> => {
  const tags = [
    {
      name: "App-Id",
      values: [APP_ID],
      op: "EQ"
    },
    {
      name: "Type",
      values: ["Form"],
      op: "EQ"
    },
    {
      name: "Status",
      values: ["active"],
      op: "EQ"
    }
  ];

  if (owner) {
    tags.push({
      name: "Owner",
      values: [owner],
      op: "EQ"
    });
  }

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
      tags
    }
  });

  const transactions = getLatestByTagValue(result, "Form-Id");

  const forms: Form[] = (
    await Promise.all(
      transactions.map(tx =>
        (async (): Promise<Form | null> => {
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

          const form: Form = data ? JSON.parse(data) : null;

          return {
            id: getArweaveTxTagValue(tx, "Form-Id"),
            questions: form?.questions,
            settings: form?.settings || {},
            title: form?.title,
            owner: form?.owner,
            unixTime: form?.unixTime,
            arweaveTxId: tx.id,
            status: form?.status
          };
        })().catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        })
      )
    )
  )
    .filter(notEmpty)
    .map(form => {
      !formSchemeValid(form) &&
        // eslint-disable-next-line no-console
        console.log(`Invalid form ${JSON.stringify(form)}`);
      return form;
    })
    .filter(formSchemeValid); // Also filters out forms with data still unavailable.

  return forms;
};
