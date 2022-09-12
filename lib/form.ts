import { Form, Pagination } from "../types";
import arweaveGraphQl from "../lib/arweaveGraphQl";
import { gql } from "@apollo/client";
import { SIGNATURE_DATA_TYPES, SIGNATURE_DOMAIN, APP_ID } from "../config";
import {
  notEmpty,
  formSchemeValid,
  getArweaveTxTagValue,
  getLatestByTagValue,
  getArweaveTxData,
  isFormSignatureValid
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

  let data: Form | undefined;
  try {
    data = await getArweaveTxData(txId);
  } catch (err) {
    ///
  }

  // Verify the signature

  const tx = result.data.transactions.edges[0].node;
  const signature = getArweaveTxTagValue(tx, "Signature");
  const formOwner = getArweaveTxTagValue(tx, "Owner");

  const message = {
    domain: SIGNATURE_DOMAIN["goerli"],
    types: SIGNATURE_DATA_TYPES,
    value: data,
    primaryType: "Form"
  };

  const form = data
    ? {
        ...data,
        signatureValid: isFormSignatureValid(message, signature, formOwner),
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
          let form: Form | undefined;
          try {
            form = await getArweaveTxData(tx.id);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
          }

          if (!form) {
            return null;
          }

          return {
            id: getArweaveTxTagValue(tx, "Form-Id"),
            description: form?.description,
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
