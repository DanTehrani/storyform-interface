import { Heading, Center, Container } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useUploadForm } from "../hooks";
import { getCurrentUnixTime } from "../utils";

import useTranslation from "next-translate/useTranslation";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import FormEditor from "../components/FormEditor";
import { Form } from "../types";

const SAMPLE_FORM_JSON = {
  title: "Title of your form",
  questions: [
    {
      label: "The question",
      type: "text|select",
      options: ["option 1", "option 2"],
      customAttributes: []
    }
  ]
};

const Create: NextPage = () => {
  const { t } = useTranslation("create");
  const { isConnected, address } = useAccount();
  const uploadForm = useUploadForm();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector()
  });

  const handleCreateClick = async (form: Form) => {
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
  };

  return (
    <Container mt={10} maxW={[1400]}>
      <Center>
        <Heading>{t("create-a-form")}</Heading>
      </Center>
      <FormEditor
        form={SAMPLE_FORM_JSON}
        onSave={handleCreateClick}
        saveButtonLabel={t("login-and-create")}
      ></FormEditor>
    </Container>
  );
};

export default Create;
