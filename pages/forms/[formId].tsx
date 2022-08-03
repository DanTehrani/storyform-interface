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
  Container
} from "@chakra-ui/react";
import IndexPageSkeleton from "../../components/IndexPageSkeleton";
import {
  useAppDispatch,
  useAppSelector,
  useGetIdentitySecret,
  useGroup
} from "../../hooks";
import { submitAnswers } from "../../state/formAnswersSlice";
import { getForm } from "../../state/formSlice";
import { useRouter } from "next/router";
import { SEMAPHORE_GROUP_ID } from "../../config";
import { poseidon } from "circomlibjs";
import { groth16Prove as generateDataSubmissionProof } from "../../lib/zksnark";
import { Identity } from "@semaphore-protocol/identity";
const {
  generateProof: generateSemaphoreMembershipProof
} = require("@semaphore-protocol/proof");
import { useAccount } from "wagmi";

const Form: NextPage = () => {
  const { query } = useRouter();
  const getIdentitySecret = useGetIdentitySecret();

  const { address } = useAccount();

  const [displayPleaseFillWarning, setDisplayPleaseFillWarning] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();
  const gettingForm = useAppSelector(state => state.form.gettingForm);
  const submissionComplete = useAppSelector(
    state => state.formAnswers.submissionComplete
  );
  const form = useAppSelector(state => state.form.form);
  const [answers, setAnswers] = useState<string[]>([]);
  const { group } = useGroup(SEMAPHORE_GROUP_ID);
  const questions = form.questions;
  const formId = query.formId?.toString();

  useEffect(() => {
    if (formId) {
      dispatch(
        getForm({
          formId
        })
      );
    }
  }, [dispatch, formId]);

  if (gettingForm) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

  const emptyRequiredFields = questions.map(({ required }, i) => ({
    questionIndex: i,
    empty: !answers.find((_, index) => index === i) && required
  }));

  const nonAnsweredFieldsExist = emptyRequiredFields.filter(
    ({ empty }) => empty
  );

  if (submissionComplete) {
    return (
      <Box>
        <Text>Thank you for answering our questions. Your answers:</Text>
      </Box>
    );
  }

  if (!formId) {
    return <></>;
  }

  const handleSubmitClick = async () => {
    if (!nonAnsweredFieldsExist) {
      setDisplayPleaseFillWarning(true);
    } else {
      if (address) {
        // const secret = poseidon([await signTypedData()]);
        const secret = await getIdentitySecret();
        const semaphoreIdentity = new Identity(secret.toString());

        // Reference: https://github.com/semaphore-protocol/boilerplate/blob/450248d33406a31b16f987c655cbe07a2ee9873d/apps/web-app/src/components/ProofStep.tsx#L48
        const externalNullifier = BigInt(0);
        const signal = "signal membership";

        // Re-construct group from on-chain data.
        const membershipFullProof = await generateSemaphoreMembershipProof(
          semaphoreIdentity,
          group,
          externalNullifier,
          signal
        );

        const secretBI = BigInt(secret);
        const formIdBI = BigInt(`0x${formId.slice(2)}`);
        const submissionId = poseidon([secretBI, formIdBI]);

        // Generate proof of knowledge of the pre image.
        const dataSubmissionFullProof = await generateDataSubmissionProof({
          secret: secretBI,
          formId: formIdBI,
          submissionId
        });

        dispatch(
          submitAnswers({
            //@ts-ignore
            formId,
            submissionId: submissionId.toString(),
            membershipProof: JSON.stringify(membershipFullProof),
            dataSubmissionProof: JSON.stringify(
              dataSubmissionFullProof,
              null,
              0
            ),
            answers
          })
        );
      }
    }
  };

  const handleInputChange = async (value: string, inputIndex: number) => {
    setAnswers(answers.map((answer, i) => (i === inputIndex ? value : answer)));
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
                  value={answers[i]}
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
                  defaultValue={question.options[0]}
                  value={answers[i]}
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
        <Button mt={4} disabled={!group} onClick={handleSubmitClick}>
          Sign and submit
        </Button>
      </Container>
    </Center>
  );
};

export default Form;
