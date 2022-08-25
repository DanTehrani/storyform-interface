export const APP_ID =
  process.env.NEXT_PUBLIC_STORY_FORM_ARWEAVE_APP_ID || "StoryForm-dev";

export const STORY_FORM_ADDRESS = {
  goerli: "0xB8F8D1AD7A8D8161223AC1276D8a361faC2534f9",
  hardhat: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
};

export const SEMAPHORE_GROUP_ID = 1;

export const SIGNATURE_DOMAIN = {
  goerli: {
    name: "StoryForm",
    version: "1",
    chainId: "5", // 4 = Rinkeby
    verifyingContract: STORY_FORM_ADDRESS.goerli
  },
  hardhat: {
    name: "StoryForm-dev",
    version: "1",
    chainId: "31337", // 4 = Rinkeby
    verifyingContract: STORY_FORM_ADDRESS.hardhat
  }
};

// TODO: Use different data type for different settings (e.g. encryptionPubKey is an optional value)
export const SIGNATURE_DATA_TYPES = {
  Setting: [
    {
      name: "respondentCriteria",
      type: "string"
    },
    {
      name: "encryptAnswers",
      type: "bool"
    }
  ],
  Question: [
    {
      name: "label",
      type: "string"
    },
    {
      name: "type",
      type: "string"
    },
    {
      name: "customAttributes",
      type: "string[]"
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
