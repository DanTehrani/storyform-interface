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
  "0x06D35f6B8Fb9Ad47A866052b6a6C3c2DcD1C36F1",
  "0xBF44E0F486f17662F2C3dBA45D70DDf02875731E"
].map(address => address.toUpperCase());
