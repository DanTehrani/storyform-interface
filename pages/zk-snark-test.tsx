import { Button } from "@chakra-ui/react";
import type { NextPage } from "next";
const snarkJs = require("snarkjs");

const ZkpSnarkTest: NextPage = () => {
  const onClick = async () => {
    const input = {
      preImage:
        "6200124807054118434578951157408887529047674408258196566301724549349210409740",
      hash: "11664357501665161177047003870533496118713896510796433421959324915847501290159"
    };
    const { proof, publicSignals } = await snarkJs.groth16.fullProve(
      input,
      "pedersen.wasm",
      "pedersen_1.zkey"
    );

    const vkey = await fetch(
      "http://localhost:3000/verification_key.json"
    ).then(function (res) {
      return res.json();
    });

    const result = await snarkJs.groth16.verify(vkey, publicSignals, proof);
  };

  return <Button onClick={onClick}></Button>;
};

export default ZkpSnarkTest;
