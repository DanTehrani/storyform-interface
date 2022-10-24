const snarkJs = require("snarkjs");
import { AttestationProofInput, FullProof } from "../types";
import { fromRpcSig, hashPersonalMessage } from "@ethereumjs/util";
import { splitToRegisters, addHexPrefix } from "../utils";
import { sha256, toUtf8Bytes } from "ethers/lib/utils";
import { MembershipProofInput, MembershipProofConfig } from "../types";
import {
  PROOF_OF_MEMBERSHIP_WASM_URI,
  PROOF_OF_MEMBERSHIP_ZKEY_URI,
  ATTESTATION_WASM_URI,
  ATTESTATION_ZKEY_URI,
  MERKLE_TREE_DEPTH
} from "../config";
import { getPointPreComputes } from "./wasmPreCompute/wasmPreCompute";
const elliptic = require("elliptic");
const ec = elliptic.ec("secp256k1");
const BN = require("bn.js");
import { poseidon } from "circomlibjs";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";

const SECP256K1_N = new BN(
  "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
  16
);

const bufferToBigInt = (buff: Buffer) =>
  BigInt(addHexPrefix(Buffer.from(buff).toString("hex")));

/**
 * Construct the input which will be passed into the circuit.
 */
const constructMembershipProofInput = async (
  addr: string,
  sig: string,
  msg: string,
  attestationPreImage: bigint,
  config: MembershipProofConfig
): Promise<MembershipProofInput> => {
  const msgHash = hashPersonalMessage(Buffer.from(msg));

  const merkleTree = new IncrementalMerkleTree(
    poseidon,
    MERKLE_TREE_DEPTH,
    BigInt(0),
    2
  ); // Binary tree.

  config.merkleLeaves.forEach(leaf => merkleTree.insert(leaf));

  const merkleProof = merkleTree.createProof(
    merkleTree.indexOf(addr.toLowerCase())
  );

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
  const attestationHash: bigint = poseidon([attestationPreImage]);

  const input: MembershipProofInput = {
    TPreComputes,
    s: splitToRegisters(bufferToBigInt(s)),
    U: [splitToRegisters(U.x), splitToRegisters(U.y)],
    siblings: merkleProof.siblings.map(s => s[0]),
    pathIndices: merkleProof.pathIndices,
    merkleRoot: merkleProof.root,
    attestationHash,
    attestationHashSquared: (attestationHash * attestationHash) % SECP256K1_N
  };

  return input;
};

/**
 * Runs the membership proof generation using a web worker.
 */
export const generateMembershipProofInBg = async ({
  address,
  message,
  signature,
  attestationPreImage,
  callback,
  config
}: {
  address: string;
  message: string;
  signature: string;
  attestationPreImage: bigint;
  config: MembershipProofConfig;
  callback: (membershipProof: FullProof) => void;
}): Promise<void> => {
  const input = await constructMembershipProofInput(
    address,
    signature,
    message,
    attestationPreImage,
    config
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
    wasmFile: PROOF_OF_MEMBERSHIP_WASM_URI,
    zKeyFile: PROOF_OF_MEMBERSHIP_ZKEY_URI
  });
};

export const generateSubmissionAttestationProof = async (
  input: AttestationProofInput
) => {
  const { attestationPreImage, submission } = input;

  const submissionHash = sha256(toUtf8Bytes(JSON.stringify(submission)));

  const finalInput = {
    attestationPreImage,
    submissionHash
  };

  const fullProof = await snarkJs.groth16.fullProve(
    finalInput,
    ATTESTATION_WASM_URI,
    ATTESTATION_ZKEY_URI
  );

  return fullProof;
};
