import Image from "next/image";
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  LinkBox,
  LinkOverlay
} from "@chakra-ui/react";

type Props = {
  title: string;
  url: string;
};

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
          <LinkOverlay href={props.url} isExternal>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"xl"}
              fontFamily={"body"}
            >
              {props.title}
            </Heading>
          </LinkOverlay>
        </Stack>
        <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
          <Stack direction={"column"} spacing={0} fontSize={"sm"}>
            <Text fontWeight={600}>Achim Rolle</Text>
            <Text color={"gray.500"}>Feb 08, 2021 · 6min read</Text>
          </Stack>
        </Stack>
      </LinkBox>
    </Center>
  );
};

export default Card;
