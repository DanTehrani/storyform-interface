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
import ConnectWalletButton from "../components/ConnectWalletButton";

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
  const uploadForm = useUploadForm();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector()
  });

  const { formInput } = useContext(CreateFormContext);

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
        <Button variant="solid" colorScheme="teal" onClick={handleCreateClick}>
          Publish
        </Button>
      </Box>
      <CreateFormHeading></CreateFormHeading>
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
