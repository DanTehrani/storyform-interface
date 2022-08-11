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
import Form from "../components/Form";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css"; //Example style, you can use another
import useTranslation from "next-translate/useTranslation";
import { Form as IForm, FormJsonInput } from "../types";

type Props = {
  form?: IForm | FormJsonInput;
  onSave: (form: IForm) => void;
  saveButtonLabel: string;
};

const FormEditor: React.FC<Props> = ({ form, onSave, saveButtonLabel }) => {
  const toast = useToast();
  const { t } = useTranslation("create");

  const [formJson, setFormJson] = useState<string>(
    form ? JSON.stringify(form) : ""
  );

  let _form;
  try {
    _form = JSON.parse(formJson);
  } catch (_) {
    //
  }

  const handleSaveClick = () => {
    if (!_form?.title || _form?.question) {
      toast({
        title: t("Invalid input"),
        status: "warning",
        duration: 5000,
        isClosable: true
      });
    } else {
      onSave(_form);
    }
  };

  return (
    <Container mt={10} maxW={[1400]}>
      <Flex justify="flex-end">
        <Button onClick={handleSaveClick}>{saveButtonLabel}</Button>
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
              <Heading size="md">{t("form-in-json-format")}</Heading>
            </Center>
            <Text></Text>
            <UnorderedList>
              <ListItem>
                <Link
                  isExternal
                  href="https://daniel-tehrani-33.gitbook.io/untitled/create-a-form"
                  textDecor="underline"
                >
                  {t("form-jon-specification")}
                </Link>
              </ListItem>
              <ListItem>
                <Text mt={3}>{t("recommended-json-editors")}</Text>
              </ListItem>
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
              <Heading size="md">{t("preview")}</Heading>
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

export default FormEditor;
