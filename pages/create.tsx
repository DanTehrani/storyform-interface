import { useContext } from "react";
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
  Tab
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useUploadForm } from "../hooks";
import { getCurrentUnixTime } from "../utils";

import useTranslation from "next-translate/useTranslation";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import CreateFormContext from "../contexts/CreateFormContext";
import FormQuestionsTab from "../components/Create/FormQuestionsTab";
import FormSettingsTab from "../components/Create/FormSettingsTab";

const Create: NextPage = () => {
  const { t } = useTranslation("create");
  const { isConnected, address } = useAccount();
  const uploadForm = useUploadForm();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector()
  });

  const { formInput, setFormInput } = useContext(CreateFormContext);

  const handleCreateClick = async () => {
    if (!isConnected) {
      await connectAsync();
    }

    uploadForm({
      owner: address,
      unixTime: getCurrentUnixTime(),
      title: formInput.title,
      questions: formInput.questions
    });
  };

  return (
    <Container mt={10} maxW={[700]}>
      <Box textAlign="right">
        <Button variant="solid" colorScheme="teal" onClick={handleCreateClick}>
          Publish
        </Button>
      </Box>
      <Center>
        <Heading>{t("create-a-form")}</Heading>
      </Center>

      <Tabs mt={4}>
        <TabList>
          <Tab>Questions</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormQuestionsTab></FormQuestionsTab>
          </TabPanel>
          <TabPanel>
            <FormSettingsTab></FormSettingsTab>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Create;
