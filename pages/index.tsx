import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Button, VStack, Image } from "@chakra-ui/react";

const Index: NextPage = () => {
  const router = useRouter();

  return (
    <VStack
      width="100%"
      height="50vh"
      justify="center"
      align="center"
      spacing={8}
    >
      <Image src="/storyform-purple.svg" width={[200]}></Image>
      <Button
        size="lg"
        onClick={() => {
          router.push("/create");
        }}
      >
        Create a form
      </Button>
      <Button
        size="lg"
        onClick={() => {
          window.open("https://docs.storyform.xyz/examples");
        }}
      >
        View example
      </Button>
    </VStack>
  );
};

export default Index;
