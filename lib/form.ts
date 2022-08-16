import { Form, Pagination, FormWithTxStatus } from "../types";
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

export const getForm = async (
  formId: string
): Promise<FormWithTxStatus | null> => {
  // sort is HEIGHT_DESC by default
  // TODO: Get the latest two, so in case the latest one is being uploaded the last version can be shown.
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
        },
        {
          name: "App-Version",
          values: ["0.0.2"],
          op: "EQ"
        }
      ]
    }
  });

  const txId = result.data.transactions.edges[0]?.node?.id;
  if (!txId) {
    return null;
  }

  const txStatusCode = await arweave.transactions.getStatus(txId);

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

  const form = data
    ? {
        ...JSON.parse(data),
        context: {},
        arweaveTxId: txId
      }
    : {};

  return {
    txStatus: txStatusCode.status,
    ...form
  };
};

export const getForms = async ({
  first,
  after,
  owner
}: Pagination & {
  owner?: string;
  // TODO Return last  and first cursor
}): Promise<FormWithTxStatus[]> => {
  const tags = [
    {
      name: "App-Id",
      values: [APP_ID],
      op: "EQ"
    },
    {
      name: "App-Version",
      values: ["0.0.2"],
      op: "EQ"
    },
    {
      name: "Type",
      values: ["Form"],
      op: "EQ"
    }
  ];

  if (owner) {
    // Temporary
    /*
    tags.push({
      name: "Owner",
      values: [owner],
      op: "EQ"
    });
    */
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

  // Get pending transactions and return
  const transactions = getLatestByTagValue(result, "Form-Id");

  const forms: FormWithTxStatus[] = (
    await Promise.all(
      transactions.map(tx =>
        (async (): Promise<FormWithTxStatus | null> => {
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

          const { status } = await arweave.transactions.getStatus(tx.id);

          const form: Form = data ? JSON.parse(data) : null;

          return {
            txStatus: status,
            id: getArweaveTxTagValue(tx, "Form-Id"),
            questions: form?.questions,
            settings: form?.settings || {},
            title: form?.title,
            context: form.context || {},
            owner: form?.owner,
            unixTime: form?.unixTime,
            arweaveTxId: tx.id
          };
        })().catch(err => {
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
    .filter(formSchemeValid);

  return forms;
};
