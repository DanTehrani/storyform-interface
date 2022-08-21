import { useContext, useEffect } from "react";
import type { NextPage } from "next";
import {
  Container,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Box,
  Button,
  Center,
  Alert,
  AlertIcon,
  CloseButton,
  Stack,
  AlertTitle,
  Text,
  AlertDescription,
  useDisclosure
} from "@chakra-ui/react";
import { useUploadForm } from "../../../hooks";
import FormNotFoundOrUploading from "../../../components/FormNotFoundOrUploading";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import FormQuestionsTab from "../../../components/FormQuestionsTab";
import FormSettingsTab from "../../../components/FormSettingsTab";
import FormSkeleton from "../../../components/FormSkeleton";
import EditFormContext from "../../../contexts/EditFormContext";
import { getCurrentUnixTime } from "../../../utils";
import ConnectWalletButton from "../../../components/ConnectWalletButton";

const ManageForm: NextPage = () => {
  const { query } = useRouter();
  const { address, isConnected } = useAccount();
  const formId = query.formId?.toString();
  const { getForm, formInput, formNotFound } = useContext(EditFormContext);
  const { uploadForm, uploadComplete, uploading } = useUploadForm();
  const {
    isOpen: isUpdateSuccessAlertOpen,
    onClose: closeUpdateSuccessAlert,
    onOpen: openUpdateSuccessAlert
  } = useDisclosure({ defaultIsOpen: false });

  useEffect(() => {
    if (formId) {
      getForm(formId);
    }
  }, [formId, getForm]);

  useEffect(() => {
    if (uploadComplete) {
      openUpdateSuccessAlert();
    }
  }, [uploadComplete, openUpdateSuccessAlert]);

  const handleSaveClick = async () => {
    if (address && formId && formInput) {
      const unixTime = getCurrentUnixTime();
      await uploadForm({
        id: formId,
        owner: address,
        unixTime,
        title: formInput.title,
        questions: formInput.questions,
        settings: formInput.settings,
        status: "active"
      });
    }
  };

  // TODO: Check form ownership

  if (!isConnected) {
    return (
      <Center mt={4}>
        <ConnectWalletButton></ConnectWalletButton>
      </Center>
    );
  }

  if (formNotFound) {
    return <FormNotFoundOrUploading></FormNotFoundOrUploading>;
  }

  if (!formInput) {
    return <FormSkeleton></FormSkeleton>;
  }

  return (
    <Container mt={10} maxW={[700]}>
      <Box textAlign="right">
        <Button
          isLoading={uploading}
          variant="solid"
          colorScheme="teal"
          onClick={handleSaveClick}
        >
          Update
        </Button>
      </Box>
      {isUpdateSuccessAlertOpen ? (
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
            <CloseButton onClick={closeUpdateSuccessAlert}></CloseButton>
          </Stack>
          <AlertIcon />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <Text>
              Your form is being updated! It will take a few minutes for the
              update to be reflected.
            </Text>
          </AlertDescription>
        </Alert>
      ) : (
        <></>
      )}
      <Tabs mt={4}>
        <TabList>
          <Tab>Questions</Tab>
          <Tab>Settings</Tab>
          <Tab>Others</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormQuestionsTab context={EditFormContext}></FormQuestionsTab>
          </TabPanel>
          <TabPanel>
            <FormSettingsTab context={EditFormContext}></FormSettingsTab>
          </TabPanel>
          <TabPanel>
            <Button variant="outline" colorScheme="red">
              Delete from
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ManageForm;
