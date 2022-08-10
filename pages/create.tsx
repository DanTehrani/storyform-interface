import { useState } from "react";
import {
  UnorderedList,
  ListItem,
  Flex,
  Box,
  Button,
  Text,
  Heading,
  Center,
  Link,
  Stack,
  Container,
  useToast
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useUploadForm } from "../hooks";
import { getCurrentUnixTime } from "../utils";
import Form from "../components/Form";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css"; //Example style, you can use another
import useTranslation from "next-translate/useTranslation";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
const SAMPLE_FORM_JSON = JSON.stringify({
  title: "Title of your form",
  questions: [
    {
      label: "The question",
      type: "text|select",
      options: ["option 1", "option 2"],
      customerAttributes: []
    }
  ]
});

const Create: NextPage = () => {
  const { t } = useTranslation("create");
  const toast = useToast();
  const { isConnected, address } = useAccount();
  const uploadForm = useUploadForm();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector()
  });
  const [formJson, setFormJson] = useState<string>(SAMPLE_FORM_JSON);

  let form;
  try {
    form = JSON.parse(formJson);
  } catch (_) {
    //
  }

  const handleCreateClick = async () => {
    if (!form.title || form.question) {
      toast({
        title: t("Invalid JSON input"),
        status: "warning",
        duration: 5000,
        isClosable: true
      });
    } else {
      if (!isConnected) {
        await connectAsync();
      }

      const formInput = {
        owner: address,
        unixTime: getCurrentUnixTime(),
        title: form.title,
        questions: form.questions
      };

      uploadForm(formInput);
    }
  };

  return (
    <Container mt={10} maxW={[1400]}>
      <Center>
        <Heading>{t("create-a-form")}</Heading>
      </Center>
      <Flex justify="flex-end">
        <Button onClick={handleCreateClick}>{t("login-and-create")}</Button>
      </Flex>
      <Box></Box>
      <Center mt={10}>
        <Stack
          direction={{ base: "column", md: "row" }}
          width="80%"
          justify={{ base: "center", md: "space-between" }}
          display="flex"
        >
          <Box minWidth={{ base: 300 }} minHeight={[400]}>
            <Center>
              <Heading size="md">Form in JSON format</Heading>
            </Center>
            <Text mt={3}>{t("recommended-json-editors")}</Text>
            <UnorderedList>
              <ListItem>
                <Link
                  isExternal
                  href="https://jsonformatter.org/json-editor"
                  textDecor="underline"
                >
                  Best JSON Editor
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  isExternal
                  textDecor="underline"
                  href="https://jsoneditoronline.org/"
                >
                  JSON Editor Online
                </Link>
              </ListItem>
            </UnorderedList>
            <Box border="solid 1px" borderRadius={5} mt={5}>
              <Editor
                value={formJson}
                onValueChange={value => {
                  setFormJson(value);
                }}
                highlight={code => highlight(code, languages.json)}
                padding={10}
                minLength={1000}
                placeholder="Your form in JSON format"
              ></Editor>
            </Box>
          </Box>

          <Box minWidth={{ base: 300, lg: 500 }} minHeight={[400]}>
            <Center>
              <Heading size="md">Preview</Heading>
            </Center>
            {form && form.title && form.questions ? (
              <Form
                title={form.title}
                questions={form.questions}
                isSubmitDisabled={true}
                onSubmit={() => {
                  //
                }}
              ></Form>
            ) : (
              <Text>Invalid json input</Text>
            )}
          </Box>
        </Stack>
      </Center>
    </Container>
  );
};

export default Create;
