import { Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";
import { uploadForm } from "../lib/form";
import { useSignTypedDataV4 } from "../hooks";
import { EIP721TypedMessage } from "../types";
import { SIGNATURE_DATA_TYPES, SIGNATURE_DOMAIN } from "../config";

const PRIMARY_TYPE = "Form";

const Create: NextPage = () => {
  const { account } = useWeb3React();
  const signTypedDataV4 = useSignTypedDataV4();

  const handleCreateClick = async () => {
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
      const message = JSON.stringify(eip712TypedMessage);

      const signature = await signTypedDataV4(account, message);
      uploadForm(signature, eip712TypedMessage);

      // Turn this in to an async function
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
