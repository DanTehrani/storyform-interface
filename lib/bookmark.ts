// @ts-ignore
import * as sha256 from "crypto-js/sha256";
import axios from "./axios";
import { gql } from "@apollo/client";
import arweaveGraphQl from "./arweaveGraphQl";
import { getWebsiteTitle } from "./webContent";
import { Bookmark, BookmarkInput } from "../types";
import arweave from "./arweve";
import {
  saveTransactionToLocalStorage,
  getTransactionDataFromLocalStorage,
  getTransactionIdsFromLocalStorage
} from "./localStorage";

/**
 * Making pagination possible
 * - Need to have a way to specify the "offset"
 * Making querying possible
 * - Need to have a way to deterministically calculate the bookmark ids
 *  -> What the nonce should be?: Incremental numbers.
 * - Have a separate pointer? -> Have a central database to store the pointers?
 */

export const getBookmarkId = (
  account: string,
  signature: string,
  nonce: number
) => sha256(account + signature + nonce);

// export const getUserBookmarks = (account: string, signature: string) => {};

export const addBookmark = async (
  account: string,
  bookmarkInput: BookmarkInput
) => {
  // const bookmarkId = getBookmarkId(account, signature);
  const res = await axios.post(`/users/${account}/bookmarks`, bookmarkInput);

  const title = await getWebsiteTitle(bookmarkInput.url);
  saveTransactionToLocalStorage({
    id: res.data,
    bookmark: {
      url: bookmarkInput.url,
      title
    }
  });

  // Save it to local storage
};

export const getBookmarks = async (): Promise<Bookmark[]> => {
  const result = await arweaveGraphQl.query({
    query: gql`
      query transactions($first: Int!, $after: String, $owners: [String!]) {
        transactions(first: $first, after: $after, owners: $owners) {
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
      owners: ["T0FzbxrsNl64BtILfXdQuwjQmTNPzOb8qJnQkEOQkIM"]
    }
  });

  const bookmarkTransactionIds: string[] = [
    ...new Set([
      ...getTransactionIdsFromLocalStorage(),
      ...result.data.transactions.edges.map(({ node }) => node.id)
    ])
  ];

  // move this to utils
  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    if (value === null || value === undefined) return false;
    return true;
  }

  const bookmarks: Bookmark[] = (
    await Promise.all(
      bookmarkTransactionIds.map((txId: string) =>
        (async (): Promise<Bookmark | null> => {
          let data: string;
          try {
            data = (
              await arweave.transactions.getData(txId, {
                decode: true,
                string: true
              })
            ).toString();
          } catch (err) {
            data = JSON.parse(getTransactionDataFromLocalStorage(txId));
          }

          if (!data) {
            return null;
          }

          const url = JSON.parse(data).url;

          return {
            url,
            title: await getWebsiteTitle(url)
          };
        })().catch(err => err)
      )
    )
  ).filter(notEmpty);

  return bookmarks;
};
