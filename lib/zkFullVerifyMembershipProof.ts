import { FullProof } from "../types";
const snarkJs = require("snarkjs");
import {
  IncrementalMerkleTree,
  MerkleProof
} from "@zk-kit/incremental-merkle-tree";
import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress
} from "@ethereumjs/util";
import { utils } from "ethers";
import { poseidon } from "circomlibjs";
import { splitToRegisters, addHexPrefix } from "../utils";

export const groth16Prove = async (args: {
  r: bigint;
  s: bigint;
  msgHash: bigint;
  pubKey: {
    x: bigint;
    y: bigint;
  };
  merkleProof: MerkleProof;
}): Promise<FullProof> => {
  const { r, s, msgHash, pubKey, merkleProof } = args;
  // eslint-disable-next-line no-console
  console.time("prove");

  const input = {
    r: splitToRegisters(r),
    s: splitToRegisters(s),
    msghash: splitToRegisters(msgHash),
    pubkey: [splitToRegisters(pubKey.x), splitToRegisters(pubKey.y)],
    siblings: merkleProof.siblings.map(s => s[0]),
    pathIndices: merkleProof.pathIndices,
    root: merkleProof.root
  };

  const fullProof = await snarkJs.groth16.fullProve(
    input,
    "full_verify_proof_of_membership.wasm",
    "full_verify_proof_of_membership.zkey"
  );

  // eslint-disable-next-line no-console
  console.timeEnd("prove");

  return fullProof;
};

const generateMerkleProof = async (addr: string): Promise<MerkleProof> => {
  const tree = new IncrementalMerkleTree(poseidon, 10, BigInt(0), 2); // Binary tree.
  tree.insert(BigInt(addr));
  // Build the tree from Ethereum addresses

  const proof = tree.createProof(0);

  return proof;
};

const bufferToBigInt = (buff: Buffer) =>
  BigInt(addHexPrefix(Buffer.from(buff).toString("hex")));

export const generateProof = async (addr: string, sig: string, msg: string) => {
  const msgHash = hashPersonalMessage(Buffer.from(msg));
  const merkleProof = await generateMerkleProof(addr);
  const { v, r, s } = fromRpcSig(sig);

  const pubKeyBuff: Buffer = ecrecover(msgHash, v, r, s);
  const pubKeyHex = pubKeyBuff.toString("hex");
  const pubKeyX = `0x${pubKeyHex.slice(0, 64)}`;
  const pubKeyY = `0x${pubKeyHex.slice(64, 128)}`;

  const fullProof = await groth16Prove({
    r: bufferToBigInt(r),
    s: bufferToBigInt(s),
    msgHash: BigInt(addHexPrefix(msgHash.toString("hex"))),
    pubKey: {
      y: BigInt(pubKeyY),
      x: BigInt(pubKeyX)
    },
    merkleProof
  }).catch(() => {
    throw new Error("Failed to generate proof");
  });

  return fullProof;
};
