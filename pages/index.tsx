import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Button, VStack } from "@chakra-ui/react";
import { useIsPoapHolder } from "../hooks";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const Index: NextPage = () => {
  const router = useRouter();

  const { isPoapHolder, getIsPoapHolder } = useIsPoapHolder();
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      getIsPoapHolder(address);
    }
  }, [getIsPoapHolder, address]);

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
    </VStack>
  );
};

export default Index;
