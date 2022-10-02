import { useContext } from "react";
import type { NextPage } from "next";
import {
  AlertIcon,
  Alert,
  Text,
  Center,
  Container,
  VStack,
  useToast
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
import BackgroundProvingContext from "../../contexts/BackgroundProvingContext";
import { useEffect, useState } from "react";
import { generateSubmissionAttestationProof } from "../../lib/zkUtils";
import { FullProof } from "../../types";

const FormPage: NextPage = () => {
  const { query } = useRouter();

  const formId = query.formId?.toString();
  const { form, formNotFound } = useForm(formId);
  const { submitForm, submissionComplete } = useSubmitForm();
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [attestationProof, setAttestationProof] = useState<FullProof | null>();

  const { isProving, fullProof: membershipProof } = useContext(
    BackgroundProvingContext
  );
  const toast = useToast();

  // Submit as soon as everything is ready
  useEffect(() => {
    if (membershipProof && attestationProof && readyToSubmit && formId) {
      submitForm({
        membershipProof,
        attestationProof,
        formId,
        answers,
        unixTime: getCurrentUnixTime(),
        appId: APP_ID
      });
    }
  }, [
    answers,
    formId,
    membershipProof,
    attestationProof,
    readyToSubmit,
    submitForm
  ]);

  useEffect(() => {
    if (isProving) {
      toast({
        title: "Started generating proof in the background...",
        status: "info",
        duration: 5000,
        isClosable: true
      });
    }
  }, [isProving, toast]);

  if (formNotFound) {
    return <FormNotFoundOrUploading></FormNotFoundOrUploading>;
  }

  if (!form) {
    return <FormSkeleton></FormSkeleton>;
  }

  if (form.status === "deleted") {
    return <FormDeleted></FormDeleted>;
  }

  if (!form.signatureValid) {
    return (
      <Center height="60vh">
        <Text fontSize="xl">The form signature is invalid. 😕</Text>
      </Center>
    );
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

  const handleSubmitClick = async (secretMessage, answers) => {
    const submission = {
      formId: formId.toString(),
      answers
    };

    // Generate message attestation proof (shouldn't take too long)
    const _attestationProof = await generateSubmissionAttestationProof(
      secretMessage,
      submission
    );

    setAttestationProof(_attestationProof);
    setAnswers(answers);
    setReadyToSubmit(true);
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
        isOpen={readyToSubmit && !submissionComplete}
        isProving={isProving}
      ></SubmittingFormModal>
    </Center>
  );
};

export default FormPage;
