import { Center, Text, Link } from "@chakra-ui/react";

const MadeWithStoryForm = () => (
  <Center mt={10}>
    <Text as="i" color="blackAlpha.400">
      Made with&nbsp;
      <Link href={window.location.origin} isExternal textDecoration="underline">
        Storyform
      </Link>
    </Text>
  </Center>
);

export default MadeWithStoryForm;
