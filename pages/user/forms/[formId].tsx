import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Container,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Box,
  Button
} from "@chakra-ui/react";
import { useUploadForm } from "../../../hooks";
import FormNotFound from "../../../components/FormNotFound";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import FormQuestionsTab from "../../../components/FormQuestionsTab";
import FormSettingsTab from "../../../components/FormSettingsTab";
import FormSkeleton from "../../../components/FormSkeleton";
import { Form } from "../../../types";
import EditFormContext from "../../../contexts/EditFormContext";
import { getCurrentUnixTime } from "../../../utils";

const ManageForm: NextPage = () => {
  const { query } = useRouter();
  const { address } = useAccount();
  const formId = query.formId?.toString();
  const { getForm, formInput, formNotFound } = useContext(EditFormContext);
  const { uploadForm, uploadComplete, uploading, url } = useUploadForm();

  useEffect(() => {
    if (formId) {
      getForm(formId);
    }
  }, [formId, getForm]);

  const handleSaveClick = async () => {
    await uploadForm({
      owner: address,
      unixTime: getCurrentUnixTime(),
      title: formInput.title,
      questions: formInput.questions
    });
  };

  if (formNotFound) {
    return <FormNotFound></FormNotFound>;
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
      <Tabs mt={4}>
        <TabList>
          <Tab>Questions</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormQuestionsTab context={EditFormContext}></FormQuestionsTab>
          </TabPanel>
          <TabPanel>
            <FormSettingsTab context={EditFormContext}></FormSettingsTab>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ManageForm;
