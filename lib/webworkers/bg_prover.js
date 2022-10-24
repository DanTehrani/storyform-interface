/* eslint-disable no-undef */

const snarkJs = require("snarkjs");

self.onmessage = e => {
  const { input, wasmFile, zKeyFile } = e.data;
  // eslint-disable-next-line no-console
  console.log("Generating proof in background...");

  // The circuit in action: https://github.com/DanTehrani/storyform/blob/main/circuits/proof_of_membership.circom
  snarkJs.groth16
    .fullProve(input, wasmFile, zKeyFile)
    .then(fullProof => {
      // eslint-disable-next-line no-console
      console.log("Background proof generation complete");
      self.postMessage(fullProof);
    })
    .catch(err => {
      self.postMessage(err);
    });
};
