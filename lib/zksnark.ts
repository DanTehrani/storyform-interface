import axios from "axios";
import { Proof, ProofInputs } from "../types";
const snarkJs = require("snarkjs");

/*
const input = {
      preImage:
        "6200124807054118434578951157408887529047674408258196566301724549349210409740",
      hash: "11664357501665161177047003870533496118713896510796433421959324915847501290159"
    };
 */

export const groth16Prove = async (inputs: ProofInputs) => {
  const proof: Proof = await snarkJs.groth16.fullProve(
    inputs,
    "/prove/prove.wasm",
    "/prove/prove_1.zkey"
  );

  return proof;
};

export const groth16VerifyProof = async (proof: Proof) => {
  const { data: vkey } = await axios.get(
    "http://localhost:3000/prove/verification_key.json"
  );

  const result = await snarkJs.groth16.verify(
    vkey,
    proof.publicSignals,
    proof.proof
  );
  return result;
};
