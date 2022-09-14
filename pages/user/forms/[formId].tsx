import { useContext, useEffect, useCallback, useState } from "react";
import type { NextPage } from "next";
import {
  Container,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Box,
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
import FormQuestionsTab from "../../../components/FormTabs/FormQuestionsTab";
import FormSettingsTab from "../../../components/FormTabs/FormSettingsTab";
import FormShareTab from "../../../components/FormTabs/FormShareTab";
import FormSkeleton from "../../../components/FormSkeleton";
import FormResponsesTab from "../../../components/FormTabs/FormResponsesTab";
import EditFormContext from "../../../contexts/EditFormContext";
import { getCurrentUnixTime } from "../../../utils";
import { APP_ID } from "../../../config";
import ConnectWalletButton from "../../../components/ConnectWalletButton";
import FormPublishButton from "../../../components/FormPublishButton";

const ManageForm: NextPage = () => {
  const { query } = useRouter();
  const { address } = useAccount();

  const formId = query.formId?.toString();
  const { getForm, formInput, formNotFound, formOwner, formStatus } =
    useContext(EditFormContext);
  const { uploadForm, uploadComplete, uploading } = useUploadForm();
  const {
    isOpen: isUpdateSuccessAlertOpen,
    onClose: closeUpdateSuccessAlert,
    onOpen: openUpdateSuccessAlert
  } = useDisclosure({ defaultIsOpen: false });
  const [showFormDeletedAlert, setShowFormDeletedAlert] =
    useState<boolean>(false);

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
        description: formInput.description,
        questions: formInput.questions,
        settings: formInput.settings,
        status: "active",
        appId: APP_ID
      });
    }
  };

  const handleDeleteFormClick = useCallback(async () => {
    const unixTime = getCurrentUnixTime();
    if (address && formId && formInput) {
      await uploadForm({
        id: formId,
        owner: address,
        unixTime,
        title: formInput.title,
        description: formInput.description,
        questions: formInput.questions,
        settings: formInput.settings,
        status: "deleted",
        appId: APP_ID
      });
      setShowFormDeletedAlert(true);
    }
  }, [address, formId, formInput, uploadForm]);

  if (address && formOwner && address !== formOwner) {
    return (
      <Center height="60vh">
        <Text fontSize="xl">You`re not the owner of this form!🙄</Text>
      </Center>
    );
  }

  if (formStatus === "deleted") {
    return (
      <Center height="60vh">
        <Text fontSize="xl">This form has been deleted!🙄</Text>
      </Center>
    );
  }

  if (!formInput) {
    return <FormSkeleton></FormSkeleton>;
  }

  if (!address) {
    return (
      <Center mt={4}>
        <ConnectWalletButton></ConnectWalletButton>
      </Center>
    );
  }

  if (formNotFound) {
    return <FormNotFoundOrUploading></FormNotFoundOrUploading>;
  }

  return (
    <Container mt={10} maxW={[850]} mb={200}>
      <Box textAlign="right">
        <FormPublishButton
          isLoading={uploading}
          buttonLabel="Update"
          onClick={handleSaveClick}
          context={EditFormContext}
        ></FormPublishButton>
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
            {showFormDeletedAlert ? (
              <Text>
                Your form is being deleted! The update will be reflected soon.
              </Text>
            ) : (
              <Text>
                Your form is being updated! The update will be reflected soon.
              </Text>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <></>
      )}
      <Tabs mt={4}>
        <TabList overflow="auto">
          <Tab>Questions</Tab>
          <Tab>Settings</Tab>
          <Tab>Share</Tab>
          <Tab>Responses</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormQuestionsTab context={EditFormContext}></FormQuestionsTab>
          </TabPanel>
          <TabPanel>
            <FormSettingsTab
              context={EditFormContext}
              onDeleteFormClick={handleDeleteFormClick}
            ></FormSettingsTab>
          </TabPanel>
          <TabPanel>
            <FormShareTab formId={formId || ""}></FormShareTab>
          </TabPanel>
          <TabPanel>
            <FormResponsesTab formId={formId || ""}></FormResponsesTab>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ManageForm;
