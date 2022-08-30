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
import { getCurrentUnixTime, getFormIdFromForm } from "../utils";

import useTranslation from "next-translate/useTranslation";
import CreateFormContext from "../contexts/CreateFormContext";
import FormQuestionsTab from "../components/FormTabs/FormQuestionsTab";
import FormSettingsTab from "../components/FormTabs/FormSettingsTab";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { FormIdPreImage } from "../types";
import { APP_ID } from "../config";

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
  const { hasCopied, onCopy } = useClipboard(url || "");
  const toast = useToast();
  const {
    isOpen: isUploadSuccessAlertOpen,
    onClose: closeUploadSuccessAlert,
    onOpen: openUploadSuccessAlert
  } = useDisclosure({ defaultIsOpen: false });
  const { isOpen: isWarningOpen, onClose: onWarningClose } = useDisclosure({
    defaultIsOpen: true
  });

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
    if (address) {
      const formIdPreImage: FormIdPreImage = {
        owner: address,
        unixTime: getCurrentUnixTime(),
        title: formInput.title,
        description: formInput.description,
        questions: formInput.questions,
        settings: formInput.settings,
        status: "active",
        appId: APP_ID
      };

      const formId = getFormIdFromForm(formIdPreImage);

      await uploadForm({ id: formId, ...formIdPreImage });
    }
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
      {isWarningOpen ? (
        <Alert status="warning" mt={4} mb={4}>
          <AlertIcon />
          <AlertDescription>
            <Text>
              The responses <Text as="b">will not be encrypted </Text>. They
              will be plainly published on Arweave. So please carefully consider
              what information to collect.
            </Text>
          </AlertDescription>
          <CloseButton onClick={onWarningClose}></CloseButton>
        </Alert>
      ) : (
        <></>
      )}
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
              Your form is being published! Your form will be available soon.
            </Text>
          </AlertDescription>
          <Stack direction="row" justify="center" mt={4}>
            <Input isReadOnly variant="filled" value={url || ""}></Input>
            <IconButton
              aria-label="Copy form url"
              icon={<CopyIcon></CopyIcon>}
              onClick={onCopy}
            ></IconButton>
            <IconButton
              aria-label="Open form url"
              icon={<ExternalLinkIcon></ExternalLinkIcon>}
              onClick={() => {
                if (url) {
                  // eslint-disable-next-line security/detect-non-literal-fs-filename
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
