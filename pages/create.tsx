import { Button, Heading, Center } from "@chakra-ui/react";
import type { NextPage } from "next";
import { uploadForm } from "../lib/form";
import { useSignTypedData } from "wagmi";
import { EIP721TypedMessage } from "../types";
import { SIGNATURE_DATA_TYPES, SIGNATURE_DOMAIN } from "../config";
import { useAccount } from "wagmi";

const underConstruction = false;
const Create: NextPage = () => {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const handleCreateClick = async () => {
    if (address) {
      const form = {
        owner: address,
        title: "My first form",
        version: 1,
        questions: JSON.stringify([
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
          },
          {
            label: "Where do you live?",
            type: "select",
            options: ["Japan", "Iran", "Canada"],
            customerAttributes: []
          }
        ])
      };

      const eip712TypedMessage: EIP721TypedMessage = {
        domain: SIGNATURE_DOMAIN,
        types: SIGNATURE_DATA_TYPES,
        value: form
      };

      const signature = await signTypedDataAsync(eip712TypedMessage);
      uploadForm(signature, eip712TypedMessage);

      // Turn this in to an async function
    }
  };

  // TODO: Check if wallet is connected or not
  return underConstruction ? (
    <Center>
      <Heading>under construction...</Heading>
    </Center>
  ) : (
    <>
      <Button onClick={handleCreateClick}></Button>
    </>
  );
};

export default Create;
