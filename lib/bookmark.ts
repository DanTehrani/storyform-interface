// @ts-ignore
import * as sha256 from "crypto-js/sha256";
import axios from "./axios";
import { gql } from "@apollo/client";
import arweaveGraphQl from "./arweaveGraphQl";
import { getWebsiteTitle } from "./webContent";
import { Bookmark, BookmarkInput, LocalStorageTransaction } from "../types";
import arweave from "./arweve";
import {
  saveTransactionToLocalStorage,
  getTransactionsFromLocalStorage,
  removeTransactionsFromLocalStorage
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

  saveTransactionToLocalStorage({
    id: res.data,
    url: bookmarkInput.url
  });

  // Save it to local storage
};

const getBookmarksFromArweave = async () => {
  // Get list of transaction ids from Arweave
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

  const bookmarkTransactionIds: string[] = result.data.transactions.edges.map(
    ({ node }) => node.id
  );

  // TODO: Move this to utils file
  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    if (value === null || value === undefined) return false;
    return true;
  }

  const bookmarks: Bookmark[] = (
    await Promise.all(
      bookmarkTransactionIds.map((txId: string) =>
        (async (): Promise<Bookmark | null> => {
          let data: string | null;
          try {
            data = (
              await arweave.transactions.getData(txId, {
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

          const url = JSON.parse(data).url;

          return {
            arweveTxId: txId,
            url,
            title: await getWebsiteTitle(url)
          };
        })().catch(err => err)
      )
    )
  ).filter(notEmpty);

  return bookmarks;
};

const getBookmarksFromLocalStorage = async (): Promise<Bookmark[]> => {
  const bookmarks = await Promise.all(
    getTransactionsFromLocalStorage().map(
      async (tx: LocalStorageTransaction) => ({
        arweveTxId: tx.id,
        url: tx.url,
        title: await getWebsiteTitle(tx.url)
      })
    )
  );

  return bookmarks;
};

export const getBookmarks = async (): Promise<Bookmark[]> => {
  // All bookmarks including duplicate
  const allBookmarks: Bookmark[] = [
    ...(await getBookmarksFromLocalStorage()),
    ...(await getBookmarksFromArweave())
  ];

  // Remove the confirmed transactions from local storage

  const duplicatedTransactionIds = allBookmarks
    .filter(
      (bookmark, i) =>
        allBookmarks.findIndex(b => b.arweveTxId === bookmark.arweveTxId) !== i
    )
    .map(tx => tx.arweveTxId);

  removeTransactionsFromLocalStorage(duplicatedTransactionIds);

  // Duplicate removed bookmarks
  const bookmarks = allBookmarks.filter(
    (bookmark, i) =>
      allBookmarks.findIndex(b => b.arweveTxId === bookmark.arweveTxId) === i
  );

  return bookmarks;
};
