import axios from "./axios";
import { Form, FormInput, EIP721TypedMessage } from "../types";
import arweaveGraphQl from "../lib/arweaveGraphQl";
import arweave from "./arweave";
import { gql } from "@apollo/client";

const APP_ID = "StoryForm-dev";

export const uploadForm = async (
  signature: string,
  eip721TypedMessage: EIP721TypedMessage
) => {
  // story-gateway will check the signature before uploading to Arweave. Hence the body structure.
  const formInput: FormInput = {
    signature,
    eip721TypedMessage
  };

  await axios.post("/forms", formInput);
};

export const getForm = async (formId: string): Promise<Form | null> => {
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
      first: 5,
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
        }
      ]
    }
  });

  const txId = result.data.transactions.edges[0]?.node?.id;
  if (!txId) {
    return null;
  }

  const data: string | null = (
    await arweave.transactions.getData(txId, {
      decode: true,
      string: true
    })
  ).toString();

  if (!data) {
    return null;
  }

  return JSON.parse(data);
};
