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
  "0x44B31836e77E74b2dA2E5B81967BB17e5b69ED5A",
  "0xBF44E0F486f17662F2C3dBA45D70DDf02875731E",
  "0x5c53414E1f15D7668c2b9EC0A92482A64845f5f6",
  "0x2cF698719aB61206334Ab380Ce7326b033409660",
  "0x3461551e8a9D68314fDD43EB81F98044DA4a1461",
  "0x1BCbF9D847a745bed5928fb67961524EF51b72d7D",
  "0x0d81e1fE8AF3Fb98275dA094c55E536966FB9976",
  "0xB39Ef9E78Ae92023E697561D76959dbFd3BB641e",
  "0xD8868daeF60fEB03842bCE70D13e3705966306E7",
  "0x701888b4E64205aa2a9F10727FA68aD71bcEdF79",
  "0xC50A9c4D28E7E5A2dd9eDFC9e0Fbf066096c9473",
  "0xC8E9Ba58eC507C6e3d05a06C74436a9693152308",
  "0xBB67D03fD1B1Ab39927ED52c845B03558B21751F",
  "0x7F2466ae8bADee7Dc0109Edd0b6Dde08C432236c",
  "0xdA38AFF9D34fF382F12a1De111A10491566B9876",
  "0x68f2f6F7B49123AB7d5A1Ad65aeb65096C3c0D9C",
  "0x98479E6D18580052E1Ed593d5fB2F3353c10f10A"
].map(address => address.toUpperCase());
