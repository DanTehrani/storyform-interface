export const APP_ID = process.env.NEXT_PUBLIC_STORY_FORM_ARWEAVE_APP_ID;

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
