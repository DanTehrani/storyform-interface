export const APP_ID = "StoryForm-dev";

export const CONTRACT_ADDRESS = {
  STORY_FORM: {
    goerli: "0xd3aAA70197b22116c6732a964edC09C853AaC941",
    local: "0xd3aAA70197b22116c6732a964edC09C853AaC941"
  },
  SEMAPHORE: {
    goerli: "0x99aAb52e60f40AAC0BFE53e003De847bBDbC9611",
    local: "0x99aAb52e60f40AAC0BFE53e003De847bBDbC9611"
  }
};

export const SEMAPHORE_GROUP_ID = 0;

export const SIGNATURE_DOMAIN = {
  chainId: "31337", // 4 = Rinkeby
  name: "StoryForm-dev",
  version: "1",
  verifyingContract: CONTRACT_ADDRESS.STORY_FORM.local
};

// TODO: move this out of config
export const SIGNATURE_DATA_TYPES = {
  Form: [
    { name: "owner", type: "string" },
    {
      name: "title",
      type: "string"
    },
    {
      name: "version",
      type: "int8"
    },
    {
      name: "questions",
      type: "string"
    }
  ]
};
