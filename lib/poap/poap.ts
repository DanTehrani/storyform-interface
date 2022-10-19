import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { poseidon } from "circomlibjs";
import axios from "../axios";

const getPoapHolders = async (eventId: number) => {
  const result = await axios.get(`/poap/${eventId}/holders`);
  return result.data.holders;
};

export const getPoapMerkleTree = async (
  eventId: number
): Promise<IncrementalMerkleTree> => {
  const holders = await getPoapHolders(eventId);

  if (holders.length > 0) {
    const tree = new IncrementalMerkleTree(poseidon, 10, BigInt(0), 2); // Binary tree.

    holders.forEach(holder => tree.insert(holder));

    return tree;
  }

  throw new Error("No POAP holders found");
  //  return new IncrementalMerkleTree(poseidon, 10, BigInt(0), 2); // Binary tree.
};
