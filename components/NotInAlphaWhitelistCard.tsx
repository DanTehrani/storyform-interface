import { VStack, Center, Text, Link, Icon } from "@chakra-ui/react";

const NotInAlphaWhitelistCard: React.FC = () => (
  <Center height="80vh">
    <VStack>
      <Text fontSize="lg">You are not in the Storyform Alpha Whitelist.</Text>
      <Text fontSize="lg" flexDir="row">
        If you you wish to try out Storyform, please send a DM to &nbsp;
        <Link
          href="https://twitter.com/storyform_xyz"
          textDecoration="underline"
          isExternal
        >
          @storyform_xyz
        </Link>
        .
      </Text>
    </VStack>
  </Center>
);

export default NotInAlphaWhitelistCard;
