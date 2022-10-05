import { useContext, useEffect } from "react";
import {
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
  AlertTitle,
  Text,
  useDisclosure,
  CloseButton,
  Button
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useUploadForm, useUserFormCount } from "../hooks";
import { getCurrentUnixTime, getFormIdFromForm, getFormUrl } from "../utils";
import CreateFormContext from "../contexts/CreateFormContext";
import FormQuestionsTab from "../components/FormTabs/FormQuestionsTab";
import FormSettingsTab from "../components/FormTabs/FormSettingsTab";
import ConnectWalletButton from "../components/ConnectWalletButton";
import NotInAlphaWhitelistCard from "../components/NotInAlphaWhitelistCard";
import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { FormIdPreImage } from "../types";
import {
  ALPHA_WHITELIST_ADDRESSES,
  APP_ID,
  MAX_ALLOWED_FORMS_PER_USER
} from "../config";
import { useToast } from "@chakra-ui/react";
import FormPublishButton from "../components/FormPublishButton";
import FormSkeleton from "../components/FormSkeleton";
import Devcon6CampaignBanner from "../components/Devcon6CampaignBanner";
import { useRouter } from "next/router";
import { useState } from "react";

const CreateFormHeading = () => {
  return (
    <Center>
      <Heading>Create a form</Heading>
    </Center>
  );
};

const Create: NextPage = () => {
  const account = useAccount();
  const { address } = account;
  const toast = useToast();

  const { uploadForm, uploadComplete, uploading } = useUploadForm();
  const { isOpen: isUploadSuccessAlertOpen, onOpen: openUploadSuccessAlert } =
    useDisclosure({ defaultIsOpen: false });
  const { isOpen: isWarningOpen, onClose: onWarningClose } = useDisclosure({
    defaultIsOpen: true
  });
  const [formId, setFormId] = useState<string | null>();
  const formUrl: string = formId ? getFormUrl(formId) : "";

  const router = useRouter();
  const { hasCopied, onCopy } = useClipboard(formUrl);

  const { formCount } = useUserFormCount();

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
      // Clear the formInput from localStorage (which was used to store the form draft)
      localStorage.setItem("formInput", "");
    }
  }, [uploadComplete, openUploadSuccessAlert]);

  const { formInput } = useContext(CreateFormContext);

  const handleCreateClick = async () => {
    const { title, description, questions, settings } = formInput;

    if (address) {
      const formIdPreImage: FormIdPreImage = {
        owner: address,
        unixTime: getCurrentUnixTime(),
        title: title,
        description: description,
        questions: questions,
        settings: settings,
        status: "active",
        appId: APP_ID
      };

      const formId = getFormIdFromForm(formIdPreImage);
      setFormId(formId);

      await uploadForm({ id: formId, ...formIdPreImage });
    }
  };

  if (!address) {
    return (
      <Container mt={10} maxW={[850]}>
        <CreateFormHeading></CreateFormHeading>
        <Center mt={4}>
          <ConnectWalletButton></ConnectWalletButton>
        </Center>
      </Container>
    );
  }

  if (!ALPHA_WHITELIST_ADDRESSES.includes(address.toUpperCase())) {
    return <NotInAlphaWhitelistCard></NotInAlphaWhitelistCard>;
  }

  if (formCount == null) {
    return <FormSkeleton></FormSkeleton>;
  }

  if (formCount != null && formCount > MAX_ALLOWED_FORMS_PER_USER) {
    return (
      <Center height="60vh">
        <Text fontSize="lg">
          Form creation limit reached ({MAX_ALLOWED_FORMS_PER_USER} forms per
          user)
        </Text>
      </Center>
    );
  }

  if (isUploadSuccessAlertOpen) {
    return (
      <Container maxW={[850]}>
        <Center height="70vh">
          <Alert
            status="success"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            mt={4}
            mb={4}
            p={20}
          >
            <AlertIcon />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              <Text>
                Your form is being published! Your form will be available soon.
              </Text>
            </AlertDescription>
            <Stack direction="row" justify="center" mt={4}>
              <Input isReadOnly variant="filled" value={formUrl}></Input>
              <IconButton
                aria-label="Copy form url"
                icon={<CopyIcon></CopyIcon>}
                onClick={onCopy}
              ></IconButton>
              <IconButton
                aria-label="Open form url"
                icon={<ExternalLinkIcon></ExternalLinkIcon>}
                onClick={() => {
                  // eslint-disable-next-line security/detect-non-literal-fs-filename
                  window.open(formUrl);
                }}
              ></IconButton>
            </Stack>
            <Stack mt={4}>
              <Button
                colorScheme="green"
                onClick={() => {
                  router.push(`/user/forms/${formId}`);
                }}
              >
                Manage form
              </Button>
            </Stack>
          </Alert>
        </Center>
      </Container>
    );
  }

  return (
    <Container mt={10} maxW={[850]} mb={200}>
      {isWarningOpen ? (
        <Alert status="warning">
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
      <Box mt={4}>
        <Devcon6CampaignBanner></Devcon6CampaignBanner>
      </Box>
      <Box textAlign="right" mt={4}>
        <FormPublishButton
          isLoading={uploading}
          onClick={handleCreateClick}
          buttonLabel="Publish"
          context={CreateFormContext}
        ></FormPublishButton>
      </Box>
      <CreateFormHeading></CreateFormHeading>
      <Tabs mt={4} defaultIndex={1}>
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
