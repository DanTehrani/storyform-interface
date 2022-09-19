import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Button, VStack } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useSignSecretMessage } from "../hooks";
import { generateProof } from "../lib/zk-proof-of-membership";

const Index: NextPage = () => {
  const router = useRouter();

  const { address } = useAccount();
  const {
    signSecretMessage,
    data: sig,
    secretMessage
  } = useSignSecretMessage();

  useEffect(() => {
    (async () => {
      if (address && sig) {
        const proof = await generateProof(sig, secretMessage);
      }
    })();
  }, [address, secretMessage, sig]);

  return (
    <VStack
      width="100%"
      height="60vh"
      justify="center"
      align="center"
      spacing={8}
    >
      <Button
        size="lg"
        variant="link"
        onClick={() => {
          router.push("/create");
        }}
      >
        Create a form
      </Button>
      <Button
        size="lg"
        variant="link"
        onClick={() => {
          window.open("https://daniel-tehrani-33.gitbook.io/");
        }}
      >
        Documentation
      </Button>
      <Button
        size="lg"
        variant="link"
        onClick={() => {
          window.open("https://github.com/DanTehrani/storyform-interface");
        }}
      >
        GitHub
      </Button>
      <Button
        size="lg"
        variant="link"
        onClick={() => {
          window.open("https://discord.gg/6HezQVqX");
        }}
      >
        Discord
      </Button>
      <Button
        onClick={() => {
          signSecretMessage();
        }}
      >
        Sign
      </Button>
    </VStack>
  );
};

export default Index;
