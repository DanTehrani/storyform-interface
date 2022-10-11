// @ts-ignore
export const APP_ID: string = process.env.NEXT_PUBLIC_STORY_FORM_ARWEAVE_APP_ID;

export const SIGNATURE_DOMAIN = {
  goerli: {
    name: "Storyform",
    version: "1",
    chainId: "5", // 4 = Rinkeby
    verifyingContract: "0xB8F8D1AD7A8D8161223AC1276D8a361faC2534f9"
  }
};

// TODO: Use different data type for different settings
export const SIGNATURE_DATA_TYPES = {
  Setting: [
    /// TBD
  ],
  Question: [
    {
      name: "label",
      type: "string"
    },
    {
      name: "type",
      type: "string"
    }
  ],
  Form: [
    { name: "id", type: "string" },
    { name: "owner", type: "string" },
    { name: "status", type: "string" },
    {
      name: "title",
      type: "string"
    },
    {
      name: "unixTime",
      type: "int256"
    },
    {
      name: "questions",
      type: "Question[]"
    },
    {
      name: "settings",
      type: "Setting"
    }
  ]
};

export const MAX_ALLOWED_FORMS_PER_USER = 5;
export const MAX_UPDATES_PER_FORM_PER_USER = 50;

export const ALPHA_WHITELIST_ADDRESSES: string[] = [
  "0x400EA6522867456E988235675b9Cb5b1Cf5b79C8",
  "0x06D35f6B8Fb9Ad47A866052b6a6C3c2DcD1C36F1"
].map(address => address.toUpperCase());

// Elliptic curve points cache config

export const STRIDE = 8n;
export const REGISTERS = 4n;
export const NUM_STRIDES = 256n / STRIDE; // = 32
export const BITS_PER_REGISTER = 64;

// Devcon6

export const POAP_CONTRACT_ADDRESS =
  "0x22C1f6050E56d2876009903609a2cC3fEf83B415";
export const DEVCON6_POAP_EVENT_ID = "69";
export const DEVCON6_POAP_BLOCK_FROM = 8732485;

export const ECDSA_VERIFY_PUBKEY_TO_ADDR_WASM_URI =
  "https://d2q52de7b4rwg.cloudfront.net/ecdsa_verify_pubkey_to_addr.wasm";

export const ECDSA_VERIFY_PUBKEY_TO_ADDR_ZKEY_URI =
  "https://d2q52de7b4rwg.cloudfront.net/ecdsa_verify_pubkey_to_addr.zkey";
