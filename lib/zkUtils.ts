import { FormSubmission, FullProof } from "../types";
const snarkJs = require("snarkjs");
import { sha256, toUtf8Bytes } from "ethers/lib/utils";
import attestationVerificationKey from "./verification_keys/attestation_verification_key.json";
// import membershipVerificationKey from "./verification_keys/membership_verification_key.json";
import membershipVerificationKey from "./verification_keys/attestation_verification_key.json";
import { Registers } from "../types";
const elliptic = require("elliptic");
const ec = elliptic.ec("secp256k1");
const BN = require("bn.js");
import { poseidon } from "circomlibjs";
import { splitToRegisters } from "../utils";
import { MESSAGE_TO_SIGN } from "../config";
import { hashPersonalMessage } from "@ethereumjs/util";
import { getPointPreComputes } from "./wasmPreCompute/wasmPreCompute";

const SECP256K1_N = new BN(
  "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
  16
);

export const computeIntermediates = (
  v: bigint,
  r: bigint,
  msgHash: bigint
): {
  U: [Registers, Registers];
  T: string;
} => {
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

  const UAsRegisters: [Registers, Registers] = [
    splitToRegisters(BigInt(U.x)),
    splitToRegisters(BigInt(U.y))
  ];

  return {
    U: UAsRegisters,
    T: T.encode("hex")
  };
};

export const verifySubmissionAttestationProof = async (
  fullProof: FullProof
): Promise<boolean> => {
  const { publicSignals, proof } = fullProof;

  // eslint-disable-next-line no-console
  console.time("verify");
  const res = await snarkJs.groth16
    .verify(attestationVerificationKey, publicSignals, proof)
    .catch(e => {
      // TODO: Report to sentry
    });

  // eslint-disable-next-line no-console
  console.timeEnd("verify");

  return Boolean(res);
};

const deconstructMembProofPubSignals = (publicSignals: any) => {
  const TPreComputes = publicSignals.slice(0, 65536);
  const U = publicSignals.slice(65536, 65536 + 8);
  const merkleRoot = publicSignals[65536 + 8];
  const attestationHash = publicSignals[65536 + 9];
  const attestationHashSquared = publicSignals[65536 + 10];
  const merkleBlockNumber = publicSignals[65536 + 11];
  const r = publicSignals.slice(65536 + 12, 65536 + 12 + 8);
  const v = publicSignals.slice(65536 + 20, 65536 + 20 + 8);

  return {
    TPreComputes,
    U,
    merkleRoot,
    attestationHash,
    attestationHashSquared,
    merkleBlockNumber,
    r,
    v
  };
};

const deconstructAttsProofPubSignals = (publicSignals: any) => {
  const attestationHash = publicSignals[0];
  const messageHash = publicSignals[2];
  const messageHashSquared = publicSignals[3];

  return {
    attestationHash,
    messageHash,
    messageHashSquared
  };
};

export const verifyMembershipProof = async (fullProof: FullProof) => {
  const { publicSignals, proof } = fullProof;

  const res = await snarkJs.groth16.verify(
    membershipVerificationKey,
    publicSignals,
    proof
  );

  const {
    TPreComputes,
    U,
    merkleRoot,
    attestationHash,
    attestationHashSquared,
    merkleBlockNumber,
    r,
    v
  } = deconstructMembProofPubSignals(publicSignals);

  const { U: expectedU, T: expectedT } = computeIntermediates(
    v,
    r,
    BigInt(
      "0x" + hashPersonalMessage(Buffer.from(MESSAGE_TO_SIGN)).toString("hex")
    )
  );

  const isUCorrect =
    U[0].every((u, i) => u === expectedU[0][i]) &&
    U[1].every((u, i) => u === expectedU[1][i]);

  const expectedTPreComputes = await getPointPreComputes(expectedT);
  const TPreComputesFlatten = TPreComputes.flat();

  const isTCorrect = expectedTPreComputes
    .flat()
    .every((t, i) => t === TPreComputesFlatten[i]);

  // Verify that the merkle root is correct
  // Get the merkle tree at the block height from group

  return res;
};

/**
  1. Verify both the membership proof and the attestation proof, and check the "link" between the two proofs
  by checking if the secret message hash  matches
  2. Check if the plain message actually hashes to the hash in the proof
  3. Check if the message hash squared matches the msgSquared in the proof
 */
export const verifyFormSubmission = async (
  formSubmission: FormSubmission & {
    membershipProof: FullProof;
    attestationProof: FullProof;
  }
): Promise<boolean> => {
  const { membershipProof, attestationProof } = formSubmission;

  if (
    !(await verifySubmissionAttestationProof(attestationProof)) ||
    !(await verifyMembershipProof(membershipProof))
  ) {
    return false;
  }

  // Check that the attestation proofs are linked

  const membProofPubSignals = deconstructMembProofPubSignals(
    membershipProof.publicSignals
  );

  const attsProofPubSignals = deconstructAttsProofPubSignals(
    attestationProof.publicSignals
  );

  if (
    attsProofPubSignals.attestationHash !== membProofPubSignals.attestationHash
  ) {
    return false;
  }

  // Check that the message(form submission) hash is correct

  return true;
};
