import type { NextPage } from "next";
import {
  AlertIcon,
  Alert,
  Button,
  Text,
  Center,
  Container,
  useToast,
  VStack
} from "@chakra-ui/react";
import {
  useGroup,
  useForm,
  useSubmitForm,
  useGenerateProof,
  useGetSubmissionId
} from "../../hooks";
import FormNotFoundOrUploading from "../../components/FormNotFoundOrUploading";
import { useRouter } from "next/router";
import { SEMAPHORE_GROUP_ID } from "../../config";
import FormSkeleton from "../../components/FormSkeleton";
import { useAccount } from "wagmi";
import { notEmpty, eligibleToAnswer } from "../../utils";
import ConnectWalletLinkButton from "../../components/ConnectWalletLinkButton";
import SubmittingFormModal from "../../components/SubmittingFormModal";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import Form from "../../components/Form";
import FormDeleted from "../../components/FormDeleted";

const FormPage: NextPage = () => {
  const { query } = useRouter();
  const router = useRouter();
  const { t } = useTranslation("[formId]");

  const { address, isConnected } = useAccount();

  const toast = useToast();

  const { group } = useGroup(SEMAPHORE_GROUP_ID);
  const formId = query.formId?.toString();
  const { form, formNotFound } = useForm(formId);
  const { submitForm, submissionComplete, submittingForm } = useSubmitForm();
  const { generatingProof, generateProof } = useGenerateProof();
  const getSubmissionId = useGetSubmissionId();

  if (formNotFound) {
    return <FormNotFoundOrUploading></FormNotFoundOrUploading>;
  }

  if (!form) {
    return <FormSkeleton></FormSkeleton>;
  }

  if (form.status === "deleted") {
    return <FormDeleted></FormDeleted>;
  }

  const { questions, settings } = form;

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
      if (settings.respondentCriteria === "ERC721") {
        // Generate zk ECDSA signature proof?
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
      } else {
        // TODO Generate a submission id randomly
        const submissionId = await getSubmissionId(formId);

        submitForm({
          formId,
          submissionId: submissionId.toString(),
          answers,
          unixTime: Math.floor(Date.now() / 1000)
        });
      }
    }
  };

  const isEligibleToAnswer = address && eligibleToAnswer(address, formId);

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
          {settings.respondentCriteria === "ERC721" && !isConnected ? (
            <Alert status="warning">
              <AlertIcon />
              <Trans
                i18nKey="[formId]:login-and-check-eligibility"
                components={{
                  loginButton: (
                    <ConnectWalletLinkButton></ConnectWalletLinkButton>
                  )
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
        </VStack>
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
        formSettings={form.settings}
      ></SubmittingFormModal>
    </Center>
  );
};

export default FormPage;
