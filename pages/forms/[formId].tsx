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

const Form: NextPage = () => {
  const { query } = useRouter();
  const router = useRouter();
  const { t } = useTranslation("form");

  const { address, isConnected } = useAccount();

  const toast = useToast();

  const [answers, setAnswers] = useState<string[]>([]);
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

  const allRequiredAnswersProvided = !questions.some(({ required }, i) => {
    const answer = answers.find((_, index) => index === i);
    return required && (answer === "" || !notEmpty(answer));
  });

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

  const handleSubmitClick = async () => {
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

  const handleInputChange = async (value: string, inputIndex: number) => {
    const newValues = new Array(questions.length)
      .fill("")
      .map((_, i) => (i === inputIndex ? value : answers[i] || ""));

    setAnswers(newValues);
  };

  const isEligibleToAnswer = address && eligibleToAnswer(address, formId);

  return (
    <Center width="100%" display={"flex"} flexDirection="column" p={6}>
      <Container maxW={640}>
        {!isConnected ? (
          <Alert status="warning">
            <AlertIcon />
            {t("login-and-check-eligibility", {
              loginButton: <ConnectWalletLinkButton></ConnectWalletLinkButton>
            })}
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
        <Heading size="md" mb={3} mt={6}>
          {form.title}
        </Heading>
        <FormControl>
          {questions.map((question, i) => (
            <Box
              key={i}
              padding="24px"
              borderWidth={1}
              borderRadius={10}
              mb={3}
              bgColor="white"
              borderColor="lightgrey"
            >
              <FormLabel mb={4}>
                {question.label}
                {question.required ? " *" : ""}
              </FormLabel>
              {question.type === "text" ? (
                <Input
                  borderWidth={"0px 0px 1px 0px"}
                  borderRadius={0}
                  padding={"0px 0px 8px"}
                  variant="unstyled"
                  onChange={e => {
                    handleInputChange(e.target.value, i);
                  }}
                  required={question.required}
                  placeholder="Enter here"
                ></Input>
              ) : question.type === "select" ? (
                <Select
                  placeholder={question.label}
                  size="lg"
                  variant="outline"
                  // @ts-ignore
                  onChange={e => {
                    handleInputChange(e.target.value, i);
                  }}
                >
                  {question.options?.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : (
                <></>
              )}
            </Box>
          ))}
        </FormControl>
        <ButtonGroup mt={4}>
          <Button
            onClick={handleSubmitClick}
            isLoading={generatingProof || submittingForm}
            isDisabled={!group || !isConnected || !isEligibleToAnswer}
          >
            {t("submit")}
          </Button>
          {!isConnected ? <ConnectWalletButton></ConnectWalletButton> : <></>}
        </ButtonGroup>
      </Container>
      <SubmittingFormModal
        generatingProof={generatingProof}
        submittingForm={submittingForm}
        isOpen={generatingProof || submittingForm}
      ></SubmittingFormModal>
    </Center>
  );
};

export default Form;
