export const APP_ID = "StoryForm-dev";

export const CONTRACT_ADDRESS = {
  STORY_FORM: {
    goerli: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    local: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  }
};

export const SEMAPHORE_GROUP_ID = 1;

export const SIGNATURE_DOMAIN = {
  chainId: "31337", // 4 = Rinkeby
  name: "StoryForm-dev",
  version: "1",
  verifyingContract: CONTRACT_ADDRESS.STORY_FORM.local
};

// TODO: move this out of config
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
