import { useState } from "react";
import type { NextPage } from "next";
import {
  Link,
  AlertIcon,
  Alert,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Button,
  Input,
  Text,
  Select,
  Center,
  Container,
  ButtonGroup,
  useToast
} from "@chakra-ui/react";
import {
  useGroup,
  useForm,
  useSubmitForm,
  useGenerateProof
} from "../../hooks";
import FormNotFound from "../../components/FormNotFound";
import { useRouter } from "next/router";
import { SEMAPHORE_GROUP_ID } from "../../config";
import ConnectWalletButton from "../../components/ConnectWalletButton";
import FormSkeleton from "../../components/FormSkeleton";
import { useAccount } from "wagmi";
import { notEmpty, eligibleToAnswer } from "../../utils";
import ConnectWalletLinkButton from "../../components/ConnectWalletLinkButton";
import SubmittingFormModal from "../../components/SubmittingFormModal";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import Form from "../../components/Form";

const FormPage: NextPage = () => {
  const { query } = useRouter();
  const router = useRouter();
  const { t } = useTranslation("form");

  const { address, isConnected } = useAccount();

  const toast = useToast();

  const { group } = useGroup(SEMAPHORE_GROUP_ID);
  const formId = query.formId?.toString();
  const { form, formNotFound } = useForm(formId);
  const { submitForm, submissionComplete, submittingForm } = useSubmitForm();
  const { generatingProof, generateProof } = useGenerateProof();

  if (formNotFound) {
    return <FormNotFound></FormNotFound>;
  }

  if (!form) {
    return <FormSkeleton></FormSkeleton>;
  }

  const questions = form.questions.map(question => ({
    ...question,
    required: true
  }));

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
        <Text fontSize="lg">{t("thank-you-for-answering")}</Text>
        <Button
          mt={5}
          onClick={() => {
            router.push(`/forms/${formId}/submissions`);
          }}
        >
          {t("view-answers")}
        </Button>
      </Center>
    );
  }

  if (!formId) {
    return <></>;
  }

  const handleSubmitClick = async answers => {
    const allRequiredAnswersProvided = !questions.some(({ required }, i) => {
      const answer = answers.find((_, index) => index === i);
      return required && (answer === "" || !notEmpty(answer));
    });

    if (!allRequiredAnswersProvided) {
      toast({
        title: t("please-fill-required-fields"),
        status: "warning",
        duration: 9000,
        isClosable: true
      });
    } else if (address) {
      const { submissionId, membershipFullProof, dataSubmissionFullProof } =
        await generateProof(formId, group);

      submitForm({
        formId,
        submissionId: submissionId.toString(),
        membershipProof: JSON.stringify(membershipFullProof, null, 0),
        dataSubmissionProof: JSON.stringify(dataSubmissionFullProof, null, 0),
        answers,
        unixTime: Math.floor(Date.now() / 1000)
      });
    }
  };

  const isEligibleToAnswer = address && eligibleToAnswer(address, formId);

  return (
    <Center width="100%" display={"flex"} flexDirection="column" p={6}>
      <Container maxW={640}>
        {!isConnected ? (
          <Alert status="warning">
            <AlertIcon />
            <Trans
              i18nKey="form:login-and-check-eligibility"
              components={{
                loginButton: <ConnectWalletLinkButton></ConnectWalletLinkButton>
              }}
            ></Trans>
          </Alert>
        ) : (
          <></>
        )}
        {isConnected && !isEligibleToAnswer ? (
          <Alert status="error">
            <AlertIcon />
            {t("cannot-answer-with-account")}
          </Alert>
        ) : (
          <></>
        )}
        <Form
          title={form.title}
          questions={form.questions}
          isSubmitDisabled={false}
          onSubmit={handleSubmitClick}
        ></Form>
      </Container>
      <SubmittingFormModal
        generatingProof={generatingProof}
        submittingForm={submittingForm}
        isOpen={generatingProof || submittingForm}
      ></SubmittingFormModal>
    </Center>
  );
};

export default FormPage;
