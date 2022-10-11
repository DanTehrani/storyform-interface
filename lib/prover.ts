const snarkJs = require("snarkjs");
import { AttestationProofInput, FullProof } from "../types";
import { fromRpcSig, hashPersonalMessage } from "@ethereumjs/util";
import { splitToRegisters, addHexPrefix } from "../utils";
import { sha256, toUtf8Bytes } from "ethers/lib/utils";
import { MembershipProofInput } from "../types";
import { getDevcon6PoapMerkleTree } from "./poap";
import {
  ECDSA_VERIFY_PUBKEY_TO_ADDR_WASM_URI,
  ECDSA_VERIFY_PUBKEY_TO_ADDR_ZKEY_URI
} from "../config";
import { getPointPreComputes } from "./wasmPreCompute/wasmPreCompute";
const elliptic = require("elliptic");
const ec = elliptic.ec("secp256k1");
const BN = require("bn.js");

const SECP256K1_N = new BN(
  "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
  16
);

const bufferToBigInt = (buff: Buffer) =>
  BigInt(addHexPrefix(Buffer.from(buff).toString("hex")));

// !Has not yet implemented construction of Merkle proof!
export const constructMembershipProofInput = async (
  addr: string,
  sig: string,
  msg: string
): Promise<MembershipProofInput> => {
  const msgHash = hashPersonalMessage(Buffer.from(msg));
  const merkleTree = await getDevcon6PoapMerkleTree();

  if (!merkleTree) {
    throw new Error("Failed to get merkle tree");
  }

  merkleTree.insert(addr);
  const merkleProof = merkleTree.createProof(merkleTree.indexOf(addr));

  const { v, r, s } = fromRpcSig(sig);

  const isYOdd = (v - BigInt(27)) % BigInt(2);
  const rPoint = ec.keyFromPublic(
    ec.curve.pointFromX(new BN(r), isYOdd).encode("hex"),
    "hex"
  );

  const rInv = new BN(r).invm(SECP256K1_N);

  // w = -(r^-1 * msg)
  const w = rInv.mul(new BN(msgHash)).neg().umod(SECP256K1_N);
  // U = -(w * G) = -(r^-1 * msg * G)
  const U = ec.curve.g.mul(w);

  // T = r^-1 * R
  const T = rPoint.getPublic().mul(rInv);

  const TPreComputes = await getPointPreComputes(T.encode("hex"));

  const input: MembershipProofInput = {
    TPreComputes,
    s: splitToRegisters(bufferToBigInt(s)),
    U: [splitToRegisters(U.x), splitToRegisters(U.y)]
    // The circuit has not yet implemented merkle proof verification!
    /*
    msghash: splitToRegisters(BigInt(addHexPrefix(msgHash.toString("hex")))),
    siblings: merkleProof.siblings.map(s => s[0]),
    pathIndices: merkleProof.pathIndices,
    root: merkleProof.root
    */
  };

  return input;
};

/**
 * !Has not yet implemented of Merkle proof verification!
 * Runs the proof generation using a web worker.
 */
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
}): Promise<void> => {
  const input = await constructMembershipProofInput(
    address,
    signature,
    message
  );

  const worker = new Worker(
    new URL("../lib/webworkers/bg_prover.js", import.meta.url)
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
