import { FullProveInput } from "../types";
import { ecrecover, fromRpcSig, hashPersonalMessage } from "@ethereumjs/util";
import { splitToRegisters, addHexPrefix } from "../utils";
import { getDevcon6PoapMerkleTree } from "./poap";

const bufferToBigInt = (buff: Buffer) =>
  BigInt(addHexPrefix(Buffer.from(buff).toString("hex")));

export const constructMembershipProofInput = async (
  addr: string,
  sig: string,
  msg: string
) => {
  const msgHash = hashPersonalMessage(Buffer.from(msg));
  const merkleTree = await getDevcon6PoapMerkleTree();

  if (!merkleTree) {
    throw new Error("Failed to get merkle tree");
  }

  const merkleProof = merkleTree.createProof(merkleTree.indexOf(addr));
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

  return input;
};
