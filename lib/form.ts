import { Form, Pagination } from "../types";
import arweaveGraphQl from "../lib/arweaveGraphQl";
import arweave from "./arweave";
import { gql } from "@apollo/client";
import { APP_ID } from "../config";
import { notEmpty, formSchemeValid } from "../utils";

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

export const getForms = async ({
  first,
  after
}: Pagination): Promise<Form[]> => {
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
          values: ["Form"],
          op: "EQ"
        }
      ]
    }
  });

  const transactions = result.data.transactions.edges.map(({ node }) => node);

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

          if (!data) {
            return null;
          }

          const form: Form = JSON.parse(data);

          return {
            id: tx.tags.find(tag => tag.name === "Form-Id")?.value,
            questions: form?.questions || [],
            title: form?.title || "",
            owner: form?.owner || "",
            version: form?.version || ""
          };
        })().catch(err => err)
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
