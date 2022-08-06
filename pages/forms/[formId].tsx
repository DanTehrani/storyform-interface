import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
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
  ButtonGroup
} from "@chakra-ui/react";
import IndexPageSkeleton from "../../components/IndexPageSkeleton";
import {
  useGetIdentitySecret,
  useGroup,
  useForm,
  useSubmitForm
} from "../../hooks";
import FormNotFound from "../../components/FormNotFound";
import { useRouter } from "next/router";
import { SEMAPHORE_GROUP_ID } from "../../config";
import { poseidon } from "circomlibjs";
import { groth16Prove as generateDataSubmissionProof } from "../../lib/zksnark";
import { Identity } from "@semaphore-protocol/identity";
import ConnectWalletButton from "../../components/ConnectWalletButton";

const {
  generateProof: generateSemaphoreMembershipProof
} = require("@semaphore-protocol/proof");
import { useAccount } from "wagmi";
import { notEmpty } from "../../utils";

const Form: NextPage = () => {
  const { query } = useRouter();
  const getIdentitySecret = useGetIdentitySecret();

  const { address, isConnected } = useAccount();

  const [answers, setAnswers] = useState<string[]>([]);
  const { group } = useGroup(SEMAPHORE_GROUP_ID);
  const formId = query.formId?.toString();
  const { form, formNotFound } = useForm(formId);
  const { submitForm, submissionComplete, submittingForm } = useSubmitForm();

  if (formNotFound) {
    return <FormNotFound></FormNotFound>;
  }

  if (!form) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
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
      <Box>
        <Text>ご回答ありがとうございます。</Text>
      </Box>
    );
  }

  if (!formId) {
    return <></>;
  }

  const handleSubmitClick = async () => {
    if (address) {
      const secret = await getIdentitySecret();
      const semaphoreIdentity = new Identity(secret.toString());

      // Reference: https://github.com/semaphore-protocol/boilerplate/blob/450248d33406a31b16f987c655cbe07a2ee9873d/apps/web-app/src/components/ProofStep.tsx#L48
      const externalNullifier = BigInt(1); // Group Id
      const signal = "0";

      // Re-construct group from on-chain data.
      const membershipFullProof = await generateSemaphoreMembershipProof(
        semaphoreIdentity,
        group,
        externalNullifier,
        signal,
        {
          wasmFilePath: "/semaphore.wasm",
          zkeyFilePath: "/semaphore.zkey"
        }
      );

      const secretBI = BigInt(secret);
      const formIdBI = BigInt(`0x${formId.slice(2)}`);
      const submissionId = poseidon([secretBI, formIdBI]);

      const dataSubmissionFullProof = await generateDataSubmissionProof({
        secret: secretBI,
        formId: formIdBI,
        submissionId
      });

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

  return (
    <Center
      width="100%"
      display={"flex"}
      flexDirection="column"
      bgColor="#f2ddc1"
      p={3}
    >
      <Container maxW={640}>
        <Heading size="md" mb={3}>
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
            isLoading={submittingForm}
            isDisabled={!group || !isConnected || !allRequiredAnswersProvided}
          >
            Sign and submit
          </Button>
          {!isConnected ? <ConnectWalletButton></ConnectWalletButton> : <></>}
        </ButtonGroup>
      </Container>
    </Center>
  );
};

export default Form;
