import { FullProveInput } from "../types";
import {
  IncrementalMerkleTree,
  MerkleProof
} from "@zk-kit/incremental-merkle-tree";
import { ecrecover, fromRpcSig, hashPersonalMessage } from "@ethereumjs/util";
import { poseidon } from "circomlibjs";
import { splitToRegisters, addHexPrefix } from "../utils";

const generateMerkleProof = async (addr: string): Promise<MerkleProof> => {
  const tree = new IncrementalMerkleTree(poseidon, 10, BigInt(0), 2); // Binary tree.
  tree.insert(BigInt(addr));
  // Build the tree from Ethereum addresses

  const proof = tree.createProof(0);

  return proof;
};

const bufferToBigInt = (buff: Buffer) =>
  BigInt(addHexPrefix(Buffer.from(buff).toString("hex")));

export const generateProof = async (
  addr: string,
  sig: string,
  msg: string,
  startProving
) => {
  const msgHash = hashPersonalMessage(Buffer.from(msg));
  const merkleProof = await generateMerkleProof(addr);
  const { v, r, s } = fromRpcSig(sig);

  const pubKeyBuff: Buffer = ecrecover(msgHash, v, r, s);
  const pubKeyHex = pubKeyBuff.toString("hex");
  const pubKeyX = `0x${pubKeyHex.slice(0, 64)}`;
  const pubKeyY = `0x${pubKeyHex.slice(64, 128)}`;

  const input: FullProveInput = {
    r: splitToRegisters(bufferToBigInt(r)),
    s: splitToRegisters(bufferToBigInt(s)),
    msghash: splitToRegisters(BigInt(addHexPrefix(msgHash.toString("hex")))),
    pubkey: [
      splitToRegisters(BigInt(pubKeyX)),
      splitToRegisters(BigInt(pubKeyY))
    ],
    siblings: merkleProof.siblings.map(s => s[0]),
    pathIndices: merkleProof.pathIndices,
    root: merkleProof.root
  };

  startProving(input);
};
