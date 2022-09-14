import { Form, EIP712TypedMessage } from "../types";
import arweaveGraphQl from "../lib/arweaveGraphQl";
import { gql } from "@apollo/client";
import { SIGNATURE_DATA_TYPES, SIGNATURE_DOMAIN, APP_ID } from "../config";
import {
  notEmpty,
  getArweaveTxTagValue,
  getArweaveTxUnixTime,
  getArweaveTxData
} from "../utils";
import {
  MessageTypes,
  recoverTypedSignature,
  SignTypedDataVersion
} from "@metamask/eth-sig-util";

const MAX_ALLOWED_FORMS_PER_USER = 5;
const MAX_UPDATES_PER_FORM_PER_USER = 250;

const verifyFormTxSignature = (tx, txData): boolean => {
  const signature = getArweaveTxTagValue(tx, "Signature");
  const formOwner = getArweaveTxTagValue(tx, "Owner");

  const message = {
    domain: SIGNATURE_DOMAIN["goerli"],
    types: SIGNATURE_DATA_TYPES,
    value: txData,
    primaryType: "Form"
  };

  const data: EIP712TypedMessage = {
    ...message,
    types: {
      ...message.types,
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" }
      ]
    },
    message: message.value
  };

  const recoveredAddr = recoverTypedSignature<
    SignTypedDataVersion.V4,
    MessageTypes
  >({
    data,
    signature,
    version: SignTypedDataVersion.V4
  });

  const isSigValid = recoveredAddr.toUpperCase() === formOwner.toUpperCase();

  return isSigValid;
};

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

  const tx = result.data.transactions.edges[0].node;

  const form = data
    ? {
        ...data,
        signatureValid: verifyFormTxSignature(tx, data),
        arweaveTxId: txId
      }
    : null;

  return form;
};

export const getForms = async ({
  owner
}: {
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
      query transactions($first: Int!, $tags: [TagFilter!]) {
        transactions(first: $first, tags: $tags) {
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
      first: MAX_UPDATES_PER_FORM_PER_USER * MAX_ALLOWED_FORMS_PER_USER,
      tags
    }
  });

  const allTxs = result.data.transactions.edges.map(({ node }) => node);

  // Form ids no duplicate
  const formIds = [
    ...new Set(allTxs.map(tx => getArweaveTxTagValue(tx, "Form-Id")))
  ];

  // Get the latest form version for each form id
  const latestFormTxs = formIds
    .map(formId => {
      const formTxs = allTxs.filter(
        tx => getArweaveTxTagValue(tx, "Form-Id") === formId
      );
      const txSortedByUnixTime = formTxs.sort(
        (tx1, tx2) => getArweaveTxUnixTime(tx2) - getArweaveTxUnixTime(tx1)
      );

      const latestFormTx = txSortedByUnixTime[0];

      return latestFormTx;
    })
    // Filter out deleted forms
    .filter(tx => getArweaveTxTagValue(tx, "Status") === "active");

  // @ts-ignore
  const forms: Form[] = (
    await Promise.all(
      latestFormTxs.map(tx =>
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
  ).filter(notEmpty);

  return forms;
};
