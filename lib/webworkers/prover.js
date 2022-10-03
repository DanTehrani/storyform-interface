/* eslint-disable no-undef */

const snarkJs = require("snarkjs");

self.onmessage = e => {
  const { input, wasmFile, zKeyFile } = e.data;
  snarkJs.groth16
    .fullProve(input, wasmFile, zKeyFile)
    .then(fullProof => {
      self.postMessage(fullProof);
    })
    .catch(err => {
      self.postMessage(err);
    });
};
