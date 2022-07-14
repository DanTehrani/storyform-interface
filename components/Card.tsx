import {
  Center,
  Heading,
  Stack,
  useColorModeValue,
  LinkBox,
  LinkOverlay,
  Button,
  Text,
  Link
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Bookmark } from "../types";

type Props = {
  bookmark: Bookmark;
};

const shortenTxId = (txId: string) => txId;

// TODO: Move this to utils file
const getTxArweaveExplorerUrl = (txId: string) =>
  `https://viewblock.io/arweave/tx/${txId}`;

const getDomainFromUrl = (url: string) => new URL(url).hostname;

const Card = (props: Props) => {
  return (
    <Center py={6}>
      <LinkBox
        as="article"
        maxW={"1000px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
      >
        <Stack>
          <LinkOverlay href={props.bookmark.url} isExternal>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"xl"}
              fontFamily={"body"}
            >
              {props.bookmark.title}
            </Heading>
          </LinkOverlay>
        </Stack>
        <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
          <Stack direction={"column"} spacing={2} fontSize={"sm"}>
            <Link href={props.bookmark.url} isExternal>
              {getDomainFromUrl(props.bookmark.url)}
            </Link>
            <LinkOverlay
              href={getTxArweaveExplorerUrl(props.bookmark.arweveTxId)}
              isExternal={true}
            >
              <Button rightIcon={<ExternalLinkIcon></ExternalLinkIcon>}>
                <Text opacity={0.5}>
                  Arweave: {shortenTxId(props.bookmark.arweveTxId)}
                </Text>
              </Button>
            </LinkOverlay>
          </Stack>
        </Stack>
      </LinkBox>
    </Center>
  );
};

export default Card;
