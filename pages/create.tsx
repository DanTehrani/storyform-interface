import { useContext, useEffect } from "react";
import {
  Button,
  Heading,
  Center,
  Container,
  Box,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  Alert,
  AlertIcon,
  AlertDescription,
  Input,
  Stack,
  IconButton,
  useClipboard,
  useToast,
  AlertTitle,
  Text,
  useDisclosure,
  CloseButton
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useUploadForm } from "../hooks";
import { getCurrentUnixTime } from "../utils";

import useTranslation from "next-translate/useTranslation";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import CreateFormContext from "../contexts/CreateFormContext";
import FormQuestionsTab from "../components/FormQuestionsTab";
import FormSettingsTab from "../components/FormSettingsTab";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";

const CreateFormHeading = () => {
  const { t } = useTranslation("create");

  return (
    <Center>
      <Heading>{t("create-a-form")}</Heading>
    </Center>
  );
};

const Create: NextPage = () => {
  const { isConnected, address } = useAccount();
  const { uploadForm, uploadComplete, uploading, url } = useUploadForm();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector()
  });
  const { hasCopied, onCopy } = useClipboard(url || "");
  const toast = useToast();
  const {
    isOpen: isUploadSuccessAlertOpen,
    onClose: closeUploadSuccessAlert,
    onOpen: openUploadSuccessAlert
  } = useDisclosure({ defaultIsOpen: false });

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: "Copied url!",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    }
  }, [hasCopied, toast]);

  useEffect(() => {
    if (uploadComplete) {
      openUploadSuccessAlert();
    }
  }, [uploadComplete, openUploadSuccessAlert]);

  const { formInput } = useContext(CreateFormContext);

  const handleCreateClick = async () => {
    if (!isConnected) {
      await connectAsync();
    }

    await uploadForm({
      owner: address,
      unixTime: getCurrentUnixTime(),
      title: formInput.title,
      questions: formInput.questions
    });
  };

  if (!isConnected) {
    return (
      <Container mt={10} maxW={[700]}>
        <CreateFormHeading></CreateFormHeading>
        <Center mt={4}>
          <ConnectWalletButton></ConnectWalletButton>
        </Center>
      </Container>
    );
  }

  return (
    <Container mt={10} maxW={[700]}>
      <Box textAlign="right">
        <Button
          isLoading={uploading}
          variant="solid"
          colorScheme="teal"
          onClick={handleCreateClick}
        >
          Publish
        </Button>
      </Box>
      {isUploadSuccessAlertOpen ? (
        <Alert
          status="success"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          mt={4}
          mb={4}
        >
          <Stack alignItems="end" width="100%">
            <CloseButton onClick={closeUploadSuccessAlert}></CloseButton>
          </Stack>
          <AlertIcon />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <Text>
              Your form is being published! It will take a few minutes for it to
              become visible.
            </Text>
          </AlertDescription>
          <Stack direction="row" justify="center" mt={4}>
            <Input isReadOnly variant="filled" value="https://hello"></Input>
            <IconButton
              aria-label="Copy form url"
              icon={<CopyIcon></CopyIcon>}
              onClick={onCopy}
            ></IconButton>
            <IconButton
              aria-label="Copy form url"
              icon={<ExternalLinkIcon></ExternalLinkIcon>}
              onClick={() => {
                if (url) {
                  window.open(url);
                }
              }}
            ></IconButton>
          </Stack>
        </Alert>
      ) : (
        <></>
      )}
      <CreateFormHeading></CreateFormHeading>
      <Tabs mt={4}>
        <TabList>
          <Tab>Questions</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormQuestionsTab context={CreateFormContext}></FormQuestionsTab>
          </TabPanel>
          <TabPanel>
            <FormSettingsTab context={CreateFormContext}></FormSettingsTab>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Create;
