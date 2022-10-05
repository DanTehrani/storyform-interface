import { ethers } from "ethers";
import poapAbi from "../abi/poap.json";
import {
  DEVCON6_POAP_BLOCK_FROM,
  DEVCON6_POAP_EVENT_ID,
  POAP_CONTRACT_ADDRESS
} from "../config";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { poseidon } from "circomlibjs";

export const getPoapContract = async () => {
  const provider = new ethers.providers.AlchemyProvider();

  const poap = new ethers.Contract(POAP_CONTRACT_ADDRESS, poapAbi, provider);

  return poap;
};

const getDevcon6PoapHolders = async () => {
  const poap = await getPoapContract();

  const mintEvents = await poap.queryFilter(
    poap.filters.EventToken(null, null),
    DEVCON6_POAP_BLOCK_FROM,
    DEVCON6_POAP_BLOCK_FROM + 500000 // Up to approx 86days after the event
  );

  const devcon6TokenIds = mintEvents
    .filter(({ args }) => args?.eventId.toString(10) === DEVCON6_POAP_EVENT_ID)
    .map(({ args }) => args?.tokenId.toString(10));

  // Then, we can to get the owner of each token id

  const transferEvents = await poap.queryFilter(
    poap.filters.Transfer(null, null, null),
    DEVCON6_POAP_BLOCK_FROM,
    DEVCON6_POAP_BLOCK_FROM + 500000 // Up to approx 86days after the event
  );

  const holders = transferEvents
    .filter(({ args }) => devcon6TokenIds.includes(args?.tokenId.toString(10)))
    .map(({ args }) => args?.to);

  return holders;
};

export const getDevcon6PoapMerkleTree = async () => {
  const holders = await getDevcon6PoapHolders();
  if (holders.length > 0) {
    const tree = new IncrementalMerkleTree(poseidon, 10, BigInt(0), 2); // Binary tree.

    holders.forEach(holder => tree.insert(holder));

    return tree;
  }
};
