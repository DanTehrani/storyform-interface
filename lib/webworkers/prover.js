/* eslint-disable no-undef */

const snarkJs = require("snarkjs");

self.onmessage = e => {
  self.postMessage(new Error("Error from worker"));

  snarkJs.groth16
    .fullProve(
      e.data,
      "http://localhost:3000/full_verify_proof_of_membership.wasm",
      "https://storage.googleapis.com/proving_keys/full_verify_proof_of_membership.zkey"
    )
    .then(fullProof => {
      self.postMessage(fullProof);
    })
    .catch(err => {
      self.postMessage(err);
    });
};
