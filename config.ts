export const SIGNATURE_DOMAIN = {
  chainId: "4",
  name: "StoryForm-dev",
  version: "1",
  verifyingContract: "0x00"
};

export const SIGNATURE_DATA_TYPES = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" }
  ],
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
