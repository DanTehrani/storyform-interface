export const APP_ID = "StoryForm-dev";

export const TEMPORARY_ADMIN_ADDRESS =
  "0x06D35f6B8Fb9Ad47A866052b6a6C3c2DcD1C36F1";

export const STORY_FORM_ADDRESS = {
  goerli: "0xB8F8D1AD7A8D8161223AC1276D8a361faC2534f9",
  hardhat: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
};

export const SEMAPHORE_GROUP_ID = 1;

export const SIGNATURE_DOMAIN = {
  goerli: {
    name: "StoryForm-dev",
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

export const SIGNATURE_DATA_TYPES = {
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
    { name: "owner", type: "string" },
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
    }
  ]
};
