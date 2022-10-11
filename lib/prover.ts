const snarkJs = require("snarkjs");
import { AttestationProofInput, FullProof } from "../types";
import { ecrecover, fromRpcSig, hashPersonalMessage } from "@ethereumjs/util";
import { splitToRegisters, addHexPrefix } from "../utils";
import { sha256, toUtf8Bytes } from "ethers/lib/utils";
import { FullProveInput } from "../types";
import { getDevcon6PoapMerkleTree } from "./poap";
import {
  ECDSA_VERIFY_PUBKEY_TO_ADDR_WASM_URI,
  ECDSA_VERIFY_PUBKEY_TO_ADDR_ZKEY_URI
} from "../config";
import { Point, utils } from "@noble/secp256k1";
import { getPointPreComputes } from "./wasmPreCompute/wasmPreCompute";

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

  merkleTree.insert(addr);

  const merkleProof = merkleTree.createProof(merkleTree.indexOf(addr));

  const { v, r, s } = fromRpcSig(sig);

  const recovery = Number(v) - 27;
  //  const rHex = `${Number(v) - 27}${r.toString("hex")}`.padStart(66, "0");
  const rHex = r.toString("hex").padStart(64, "0");

  // Might be incorrectly setting the recovery value here
  const rCompressedHex = recovery === 1 ? rHex : `${recovery}${rHex}`;

  const R = Point.fromHex(rCompressedHex);
  const rInv = utils.invert(BigInt("0x" + r.toString("hex")));
  const w = utils.mod(rInv * BigInt("0x" + msgHash.toString("hex")) * -1n);
  const U = Point.BASE.multiply(w);

  const T = R.multiply(rInv);

  const TPreComputes = await getPointPreComputes(T.toHex());

  const input: FullProveInput = {
    TPreComputes,
    s: splitToRegisters(bufferToBigInt(s)),
    U: [splitToRegisters(U.x), splitToRegisters(U.y)]
    /*
    msghash: splitToRegisters(BigInt(addHexPrefix(msgHash.toString("hex")))),
    siblings: merkleProof.siblings.map(s => s[0]),
    pathIndices: merkleProof.pathIndices,
    root: merkleProof.root
    */
  };

  return input;
};

export const generateMembershipProofInBg = async ({
  address,
  message,
  signature,
  callback
}: {
  address: string;
  message: string;
  signature: string;
  callback: (membershipProof: FullProof) => void;
}) => {
  const input = await constructMembershipProofInput(
    address,
    signature,
    message
  );

  const worker = new Worker(
    new URL("../lib/webworkers/prover.js", import.meta.url)
  );

  // Define worker callback
  worker.onmessage = e => {
    if (e.data instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(e.data);
      // TODO: Report error to Sentry
    } else {
      const _membershipProof = e.data;
      callback(_membershipProof);
    }
  };

  worker.postMessage({
    input,
    wasmFile: ECDSA_VERIFY_PUBKEY_TO_ADDR_WASM_URI,
    zKeyFile: ECDSA_VERIFY_PUBKEY_TO_ADDR_ZKEY_URI
  });
};

export const generateSubmissionAttestationProof = async (
  input: AttestationProofInput
) => {
  const { secret, submission } = input;

  const submissionHash = sha256(toUtf8Bytes(JSON.stringify(submission)));

  const encodedInput = {
    secret,
    submissionHash
  };

  const fullProof = await snarkJs.groth16.fullProve(
    encodedInput,
    "/attest_membership_proof.wasm",
    "/attest_membership_proof.zkey"
  );

  return fullProof;
};
