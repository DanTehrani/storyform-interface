import type { NextPage } from "next";
import {
  AlertIcon,
  Alert,
  Text,
  Center,
  Container,
  VStack
} from "@chakra-ui/react";
import { useForm, useSubmitForm } from "../../hooks";
import FormNotFoundOrUploading from "../../components/FormNotFoundOrUploading";
import { useRouter } from "next/router";
import { APP_ID } from "../../config";
import FormSkeleton from "../../components/FormSkeleton";
import { getCurrentUnixTime } from "../../utils";
import SubmittingFormModal from "../../components/SubmittingFormModal";
import { motion } from "framer-motion";
import Form from "../../components/Form";
import FormDeleted from "../../components/FormDeleted";

const FormPage: NextPage = () => {
  const { query } = useRouter();

  const formId = query.formId?.toString();
  const { form, formNotFound } = useForm(formId);
  const { submitForm, submissionComplete, submittingForm } = useSubmitForm();

  if (formNotFound) {
    return <FormNotFoundOrUploading></FormNotFoundOrUploading>;
  }

  if (!form) {
    return <FormSkeleton></FormSkeleton>;
  }

  if (form.status === "deleted") {
    return <FormDeleted></FormDeleted>;
  }

  if (submissionComplete) {
    return (
      <Center
        as={motion.div}
        height="70vh"
        justifyContent="center"
        flexDirection="column"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Text fontSize="lg">Thank you for completing our survey.</Text>
      </Center>
    );
  }

  if (!formId) {
    return <></>;
  }

  const handleSubmitClick = async answers => {
    submitForm({
      formId,
      answers,
      unixTime: getCurrentUnixTime(),
      appId: APP_ID
    });
  };

  return (
    <Center width="100%" display={"flex"} flexDirection="column" p={6}>
      <Container maxW={640}>
        <VStack spacing={4}>
          <Alert status="warning">
            <AlertIcon />
            <Text>
              Your answer will be uploaded to Arweave. You may not be able to
              delete your submission, so please carefully consider what
              information to enter.
            </Text>
          </Alert>
        </VStack>
        <Form
          title={form.title}
          description={form.description}
          questions={form.questions}
          isSubmitDisabled={false}
          onSubmit={handleSubmitClick}
        ></Form>
      </Container>
      <SubmittingFormModal
        submittingForm={submittingForm}
        isOpen={submittingForm}
      ></SubmittingFormModal>
    </Center>
  );
};

export default FormPage;
