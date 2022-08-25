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
  useGenerateProof
} from "../../hooks";
import FormNotFoundOrUploading from "../../components/FormNotFoundOrUploading";
import { useRouter } from "next/router";
import { APP_ID, SEMAPHORE_GROUP_ID } from "../../config";
import FormSkeleton from "../../components/FormSkeleton";
import { useAccount } from "wagmi";
import { notEmpty, eligibleToAnswer, getCurrentUnixTime } from "../../utils";
import ConnectWalletLinkButton from "../../components/ConnectWalletLinkButton";
import SubmittingFormModal from "../../components/SubmittingFormModal";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import Form from "../../components/Form";
import FormDeleted from "../../components/FormDeleted";
import { encryptSafely } from "@metamask/eth-sig-util";

const FormPage: NextPage = () => {
  const { query } = useRouter();
  const { t } = useTranslation("[formId]");

  const { address, isConnected } = useAccount();

  const { group } = useGroup(SEMAPHORE_GROUP_ID);
  const formId = query.formId?.toString();
  const { form, formNotFound } = useForm(formId);
  const { submitForm, submissionComplete, submittingForm } = useSubmitForm();
  const { generatingProof, generateProof } = useGenerateProof();

  if (formNotFound) {
    return <FormNotFoundOrUploading></FormNotFoundOrUploading>;
  }

  if (!form) {
    return <FormSkeleton></FormSkeleton>;
  }

  if (form.status === "deleted") {
    return <FormDeleted></FormDeleted>;
  }

  const { settings } = form;
  const { encryptionPubKey, encryptAnswers } = settings;

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
      </Center>
    );
  }

  if (!formId) {
    return <></>;
  }

  const handleSubmitClick = async _answers => {
    if (encryptAnswers && address) {
      if (encryptAnswers && !encryptionPubKey) {
        // TODO Show error.
        return;
      }

      const answers = encryptAnswers
        ? encryptSafely({
            data: JSON.stringify(_answers, null, 0),
            // @ts-ignore
            publicKey: settings.encryptionPubKey,
            version: "x25519-xsalsa20-poly1305"
          })
        : _answers;

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
          unixTime: getCurrentUnixTime(),
          appId: APP_ID
        });
      }
    } else {
      // No need to specify a submission id.
      submitForm({
        formId,
        answers: _answers,
        unixTime: getCurrentUnixTime(),
        appId: APP_ID
      });
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
          description={form.description}
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
