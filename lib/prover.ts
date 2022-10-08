import {
  AttestationProofInput,
  FormSubmission,
  FullProof,
  Submission
} from "../types";
const snarkJs = require("snarkjs");
import { ecrecover, fromRpcSig, hashPersonalMessage } from "@ethereumjs/util";
import { splitToRegisters, addHexPrefix, getSecretMessage } from "../utils";
import { sha256, toUtf8Bytes } from "ethers/lib/utils";
import attestationVerificationKey from "./verification_keys/attestation_verification_key.json";
// import membershipVerificationKey from "./verification_keys/membership_verification_key.json";
import membershipVerificationKey from "./verification_keys/attestation_verification_key.json";
import { poseidon } from "circomlibjs";
import { FullProveInput } from "../types";
import { getDevcon6PoapMerkleTree } from "./poap";

const hashRegistersWithPoseidon = (registers: bigint[]) => {
  const hash = poseidon(registers);
  return hash;
};

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
export const generateMembershipProofInBg = async ({
  address,
  signSecretMessage,
  callback
}) => {
  const secretMsg = getSecretMessage();

  // Prompts user to sign the message
  const sig = await signSecretMessage({
    message: secretMsg
  });

  const worker = new Worker(
    new URL("../lib/webworkers/prover.js", import.meta.url)
  );

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

  const input = constructMembershipProofInput(address, sig, secretMsg);

  worker.postMessage({
    input,
    wasmFile: `${window.origin}/proof_of_membership.wasm`,
    zKeyFile:
      "https://storage.googleapis.com/proving_keys/proof_of_membership_1.zkey"
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
