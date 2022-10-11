import { FormSubmission, FullProof } from "../types";
const snarkJs = require("snarkjs");
import { sha256, toUtf8Bytes } from "ethers/lib/utils";
import attestationVerificationKey from "./verification_keys/attestation_verification_key.json";
// import membershipVerificationKey from "./verification_keys/membership_verification_key.json";
import membershipVerificationKey from "./verification_keys/attestation_verification_key.json";

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

export const verifyMembershipProof = async (fullProof: FullProof) => {
  const { publicSignals, proof } = fullProof;
  const res = await snarkJs.groth16.verify(
    membershipVerificationKey,
    publicSignals,
    proof
  );
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

  // Check the "link" between the two proofs
  const { publicSignals: membershipPublicSignals } = membershipProof;
  const { publicSignals: attestationPublicSignals } = attestationProof;

  const submissionHash = sha256(
    toUtf8Bytes(
      JSON.stringify({
        formId: formSubmission.formId,
        answers: formSubmission.answers
      })
    )
  );

  // Check the submission actually hashes to the hash in the proof
  if (submissionHash !== attestationPublicSignals[2]) {
    return false;
  }

  return true;
};
