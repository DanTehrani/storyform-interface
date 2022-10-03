/* eslint-disable no-undef */

const snarkJs = require("snarkjs");

self.onmessage = e => {
  self.postMessage(new Error("Error from worker"));

  snarkJs.groth16
    .fullProve(
      e.data,
      "http://localhost:3000/proof_of_membership.wasm",
      "https://storage.googleapis.com/proving_keys/proof_of_membership_1.zkey"
    )
    .then(fullProof => {
      self.postMessage(fullProof);
    })
    .catch(err => {
      self.postMessage(err);
    });
};
