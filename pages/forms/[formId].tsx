import { useContext } from "react";
import type { NextPage } from "next";
import {
  AlertIcon,
  Alert,
  Text,
  Center,
  Container,
  VStack,
  useToast,
  Box,
  ButtonGroup,
  Button,
  FormControl,
  Input,
  FormLabel,
  Heading,
  Select
} from "@chakra-ui/react";
import { useForm, useSubmitForm } from "../../hooks";
import FormNotFoundOrUploading from "../../components/FormNotFoundOrUploading";
import { ArrowBackIcon } from "@chakra-ui/icons";
import MadeWithStoryForm from "../../components/MadeWithStoryForm";
import { useRouter } from "next/router";
import { APP_ID } from "../../config";
import FormSkeleton from "../../components/FormSkeleton";
import { getCurrentUnixTime, notEmpty } from "../../utils";
import SubmittingFormModal from "../../components/SubmittingFormModal";
import { motion } from "framer-motion";
import FormDeleted from "../../components/FormDeleted";
import ProverContext from "../../contexts/ProverContext";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ConnectWalletButton from "../../components/ConnectWalletButton";

const StyledBox = props => {
  return (
    <Box
      padding="24px"
      borderWidth={1}
      borderRadius={10}
      mb={3}
      bgColor="white"
      borderColor="lightgrey"
      {...props}
    >
      {props.children}
    </Box>
  );
};

const FormPage: NextPage = () => {
  const router = useRouter();

  const formId = router.query.formId?.toString();
  const { form, formNotFound } = useForm(formId as string);
  const { submitForm, submissionComplete, txId } = useSubmitForm();
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const toast = useToast();
  const { address } = useAccount();

  const {
    membershipProof,
    attestationProof,
    isBgProvingMembership,
    generateMembershipProofInBg,
    generateAttestationProof
  } = useContext(ProverContext);

  // Submit as soon as
  // the membership proof, submission,
  // and the attestation proof is ready
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
    if (isBgProvingMembership) {
      toast({
        title: "Started generating proof in the background...",
        status: "info",
        duration: 5000,
        isClosable: true
      });
    }
  }, [isBgProvingMembership, toast]);

  if (formNotFound) {
    return <FormNotFoundOrUploading></FormNotFoundOrUploading>;
  }

  // Loading...
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

  const { title, description, questions, settings } = form;

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
        <Text fontSize="lg">Thank you for completing our survey</Text>
        <Button
          mt={4}
          onClick={() => {
            router.push(`/forms/${formId}/submissions/${txId}`);
          }}
        >
          View your submission
        </Button>
      </Center>
    );
  }

  if (!formId) {
    return <></>;
  }

  const handleInputChange = async (value: string, inputIndex: number) => {
    const newValues = new Array(questions.length)
      .fill("")
      // eslint-disable-next-line security/detect-object-injection
      .map((_, i) => (i === inputIndex ? value : answers[i] || ""));

    setAnswers(newValues);
  };

  const handleNextClick = () => {
    const allRequiredAnswersProvided = !questions.some(({ required }, i) => {
      const answer = answers.find((_, index) => index === i);
      return required && (answer === "" || !notEmpty(answer));
    });

    if (allRequiredAnswersProvided) {
      setShowConfirmation(true);
    } else {
      toast({
        title: "Please fill the required fields",
        status: "warning",
        duration: 9000,
        isClosable: true
      });
    }
  };

  const handleSubmitClick = async () => {
    const submission = {
      formId: formId.toString(),
      answers
    };

    // Only generate attestation proof if the form is gated anonymous survey
    if (settings?.gatedAnon) {
      // Generate message attestation proof (shouldn't take too long)
      await generateAttestationProof(submission);
    }

    setAnswers(answers);
    setReadyToSubmit(true);
  };

  if (showConfirmation) {
    return (
      <Container>
        <Heading size="md" mt={6}>
          Confirm submission
        </Heading>
        <Box mt={4}>
          {questions.map((question, i) => (
            <StyledBox key={i}>
              <Text>{question.label}</Text>
              <Text as="b">
                {
                  // eslint-disable-next-line security/detect-object-injection
                  answers[i]
                }
              </Text>
            </StyledBox>
          ))}
          <ButtonGroup mt={4}>
            <Button
              onClick={() => {
                setShowConfirmation(false);
              }}
              leftIcon={<ArrowBackIcon fontSize="sm"></ArrowBackIcon>}
              iconSpacing={1}
            >
              Back
            </Button>
            <Button onClick={handleSubmitClick}>Submit</Button>
          </ButtonGroup>
        </Box>
        <MadeWithStoryForm></MadeWithStoryForm>
      </Container>
    );
  }

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
        <Container>
          <Heading size="md" mt={6}>
            {title}
          </Heading>
          <Text mt={4}>{description}</Text>
          {settings.gatedAnon && !address ? (
            // User is not signed in, so render sign in button
            <Container mt={10} maxW={[850]}>
              <Center>
                <ConnectWalletButton label="Sign in to answer"></ConnectWalletButton>
              </Center>
            </Container>
          ) : settings.gatedAnon && !isBgProvingMembership ? (
            // User is signed in and the form is gated, so start generating proof
            <Container mt={10} maxW={[850]}>
              <Center>
                <Button
                  onClick={() => {
                    generateMembershipProofInBg({
                      poapEventId: settings.poapEventId as number
                    });
                  }}
                >
                  Generate membership proof
                </Button>
              </Center>
            </Container>
          ) : (
            // User is eligible to answer the form
            <>
              <FormControl mt={4}>
                {questions.map((question, i) => (
                  <StyledBox key={i} mb={3}>
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
                        value={
                          // eslint-disable-next-line security/detect-object-injection
                          answers[i]
                        }
                      ></Input>
                    ) : question.type === "select" ? (
                      <>
                        <Select
                          placeholder="Please select"
                          size="lg"
                          variant="outline"
                          // @ts-ignore
                          onChange={e => {
                            if (question.other && e.target.value === "other") {
                              setShowOtherInput(true);
                              handleInputChange("", i);
                            } else {
                              handleInputChange(e.target.value, i);
                              setShowOtherInput(false);
                            }
                          }}
                          value={
                            // eslint-disable-next-line security/detect-object-injection
                            answers[i]
                          }
                        >
                          {question.options?.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                          {question.other ? (
                            <option key="other" value="other">
                              Other
                            </option>
                          ) : (
                            <></>
                          )}
                        </Select>
                        {question.other && showOtherInput ? (
                          <Input
                            mt={4}
                            borderWidth={"0px 0px 1px 0px"}
                            borderRadius={0}
                            padding={"0px 0px 8px"}
                            variant="unstyled"
                            onChange={e => {
                              handleInputChange(e.target.value, i);
                            }}
                            required={question.required}
                            placeholder="Enter here"
                            value={
                              // eslint-disable-next-line security/detect-object-injection
                              answers[i]
                            }
                          ></Input>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </StyledBox>
                ))}
              </FormControl>
              <ButtonGroup mt={4}>
                <Button onClick={handleNextClick}>Next</Button>
              </ButtonGroup>
            </>
          )}
          <MadeWithStoryForm></MadeWithStoryForm>
        </Container>
      </Container>
      <SubmittingFormModal
        isOpen={readyToSubmit && !submissionComplete}
        isProving={isBgProvingMembership}
      ></SubmittingFormModal>
    </Center>
  );
};

export default FormPage;
