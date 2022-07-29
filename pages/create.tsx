import { Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";
import { uploadForm } from "../lib/form";
import { EIP721TypedMessage } from "../types";

const SIGNATURE_DOMAIN = {
  chainId: "4",
  name: "StoryForm-dev",
  version: "1",
  verifyingContract: "0x00"
};

const SIGNATURE_DATA_TYPES = {
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

const PRIMARY_TYPE = "Form";

const Create: NextPage = () => {
  const { account, library: web3 } = useWeb3React();

  const handleCreateClick = () => {
    // Construct the message object here
    if (account) {
      const form = {
        owner: account,
        title: "My first form",
        version: "1",
        questions: [
          {
            label: "What's your name?",
            type: "text",
            customerAttributes: []
          },
          {
            label: "Where do you live?",
            type: "select",
            options: ["Japan", "Iran", "Canada"],
            customerAttributes: []
          }
        ]
      };

      const eip712TypedMessage: EIP721TypedMessage = {
        domain: SIGNATURE_DOMAIN,
        types: SIGNATURE_DATA_TYPES,
        primaryType: PRIMARY_TYPE,
        message: form
      };
      const msg = JSON.stringify(eip712TypedMessage);

      // Turn this in to an async function
      web3.currentProvider.send(
        {
          method: "eth_signTypedData_v4",
          params: [account, msg],
          from: account
        },
        (err, sig) => {
          uploadForm(sig.result, eip712TypedMessage);
          if (err) {
            /* eslint-disable no-console */
            console.error(err);
          }
        }
      );
    }
  };

  // TODO: Check if wallet is connected or not
  return (
    <>
      <Button onClick={handleCreateClick}></Button>
    </>
  );
};

export default Create;
