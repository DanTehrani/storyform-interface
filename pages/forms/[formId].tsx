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
  ButtonGroup,
  useToast
} from "@chakra-ui/react";
import IndexPageSkeleton from "../../components/IndexPageSkeleton";
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

import { useAccount } from "wagmi";
import { notEmpty } from "../../utils";

const Form: NextPage = () => {
  const { query } = useRouter();
  const router = useRouter();

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
      <Center height="70vh" justifyContent="center" flexDirection="column">
        <Text fontSize="lg">
          ご回答ありがとうございます。 回答が反映されるまで数分かかります 。
        </Text>
        <Button
          mt={5}
          onClick={() => {
            router.push(`/forms/${formId}/submissions`);
          }}
        >
          回答一覧を見る
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
        title: "必須項目を入力してください",
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
            isLoading={generatingProof || submittingForm}
            isDisabled={!group || !isConnected}
          >
            送信
          </Button>
          {!isConnected ? <ConnectWalletButton></ConnectWalletButton> : <></>}
        </ButtonGroup>
      </Container>
    </Center>
  );
};

export default Form;
