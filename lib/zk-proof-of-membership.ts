import { FullProof } from "../types";
const snarkJs = require("snarkjs");
import {
  IncrementalMerkleTree,
  MerkleProof
} from "@zk-kit/incremental-merkle-tree";
const BN = require("bn.js");
const defineCurve = require("@DanTehrani/elliptic").curves.defineCurve;
const EC = require("@DanTehrani/elliptic").ec;
import { ecrecover, fromRpcSig, hashPersonalMessage } from "@ethereumjs/util";
import { utils } from "ethers";
import { buildPoseidon } from "circomlibjs";
const ec = new EC("secp256k1");
const hash = require("hash.js");
import { splitToRegisters, addHexPrefix } from "../utils";

export const groth16Prove = async (args: {
  modInvRMultPubKey2: {
    x: bigint;
    y: bigint;
  };
  negMsgMultModInvR: bigint;
  pubKey2: {
    x: bigint;
    y: bigint;
  };
  merkleProof: MerkleProof;
}): Promise<FullProof> => {
  const { modInvRMultPubKey2, negMsgMultModInvR, merkleProof } = args;
  // eslint-disable-next-line no-console
  console.time("prove");

  const input = {
    modInvRMultPubKey2: [
      splitToRegisters(modInvRMultPubKey2.x),
      splitToRegisters(modInvRMultPubKey2.y)
    ],
    negMsgMultModInvR: splitToRegisters(negMsgMultModInvR),
    siblings: merkleProof.siblings.map(s =>
      s[0] ? addHexPrefix(Buffer.from(s[0]).toString("hex")) : s[0].toString()
    ),
    pathIndices: merkleProof.pathIndices
  };

  const fullProof = await snarkJs.groth16
    .fullProve(input, "proof_of_membership.wasm", "proof_of_membership.zkey")
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

  // eslint-disable-next-line no-console
  console.timeEnd("prove");

  return fullProof;
};

const generateMerkleProof = async (pubKey: string): Promise<MerkleProof> => {
  const poseidon = await buildPoseidon();

  const tree = new IncrementalMerkleTree(poseidon, 10, BigInt(0), 2); // Binary tree.
  const pubKeyHash = utils.keccak256(utils.toUtf8Bytes(pubKey));
  tree.insert(pubKeyHash);
  // Build the tree from Ethereum addresses

  const proof = tree.createProof(0);
  return proof;
};

const msg2 = new BN(0x123, "hex");

const baseRSecp256k1Template = {
  type: "short",
  prime: "k256",
  p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
  a: "0",
  b: "7",
  n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
  h: "1",
  hash: hash.sha256,
  gRed: false,
  g: [
    // x and y coordinates of the generator point which is the point R
  ]
};

const SECP256K1_N = new BN(
  "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
  16
);

// Compute r^-1 * pubKey2
const computeModInvRMultPubKey2 = (r, pubKey2) => {
  const rRed = new BN(r);
  const modInvR = rRed.invm(SECP256K1_N); // r^-1

  const modInvRMultPubKey2 = pubKey2.mul(modInvR); // pubKey2 * r^-1
  return modInvRMultPubKey2.getPublic();
};

// TODO: Update this to the newer method
export const generateProof = async (sig: string, secretMsg: string) => {
  const { v, r, s } = fromRpcSig(sig);
  const pubKey: Buffer = ecrecover(
    hashPersonalMessage(Buffer.from(secretMsg)),
    v,
    r,
    s
  );

  const pubKeyHex = pubKey.toString("hex");

  const pubKeyX = `${pubKeyHex.slice(0, 64)}`;
  const pubKeyY = `${pubKeyHex.slice(64, 128)}`;

  const pubKeyPoint = ec.keyFromPublic({
    x: Buffer.from(pubKeyX, "hex"),
    y: Buffer.from(pubKeyY, "hex")
  });

  /*
    If R.y is odd, then recovery_id is 1 or 3. If y is even, then recovery_id is 0 or 2.
    And recovery_id := v - 27
  */
  const isYOdd = (v - BigInt(27)) % BigInt(2);
  const rPoint = ec.keyFromPublic(
    ec.curve.pointFromX(new BN(r), isYOdd).encode("hex"),
    "hex"
  );

  defineCurve("r", {
    ...baseRSecp256k1Template,
    g: [rPoint.pub.x.toString("hex"), rPoint.pub.y.toString("hex")]
  });

  const baseRSecp256k1 = EC("r");

  // Generate a signature using s as the secret key, with the generator point R
  const sig2 = baseRSecp256k1.keyFromPrivate(new BN(s)).sign(msg2);

  const r2 = sig2.r;
  const s2 = sig2.s;

  // The y coordinate should be correct (odd or even)
  const r2Point = ec.keyFromPublic(
    ec.curve.pointFromX(r2, sig2.recoveryParam).encode("hex"),
    "hex"
  );

  // pubKey2 = s * R
  const pubKey2 = rPoint.getPublic().mul(new BN(s));

  // Verify the second signature by checking s2 * R2 = msg2 * R + r2 * pubKey2
  // This should be done on a smart contract
  const s2MulR2 = r2Point.getPublic().mul(s2);
  const msg2MulR = rPoint.getPublic().mul(msg2);
  const r2MulPubKey2 = ec
    .keyFromPublic(pubKey2.encode("hex"), "hex")
    .getPublic()
    .mul(r2);

  if (!s2MulR2.eq(msg2MulR.add(r2MulPubKey2))) {
    throw new Error("Second the signature is invalid!");
  }

  // Verify that pubKey2 = m * G + r * pubKey

  // The spec: http://man.hubwiz.com/docset/Ethereum.docset/Contents/Resources/Documents/eth_sign.html
  const secretMessageHash = hashPersonalMessage(Buffer.from(secretMsg));

  const modInvRMultPubKey2 = computeModInvRMultPubKey2(r, pubKey2);

  const rRed = new BN(r);
  // -(r^-1 * msg)
  const negMsgMultModInvR = rRed
    .invm(SECP256K1_N)
    .mul(new BN(secretMessageHash))
    .neg()
    .umod(SECP256K1_N);

  const mMulG = ec.keyFromPrivate(secretMessageHash).getPublic();
  const rMulPubKey = ec
    .keyFromPublic(pubKeyPoint.getPublic().encode("hex"), "hex")
    .getPublic()
    .mul(r);

  if (!mMulG.add(rMulPubKey).eq(pubKey2)) {
    throw new Error("pubKey2 doesn't equal m * G + r * pubKey");
  }

  const merkleProof = await generateMerkleProof(pubKeyHex);

  const fullProof = await groth16Prove({
    modInvRMultPubKey2,
    negMsgMultModInvR,
    pubKey2,
    merkleProof
  });

  return {
    s2,
    pubKey2,
    fullProof: null,
    rPoint,
    r2Point,
    msg2
  };
};
