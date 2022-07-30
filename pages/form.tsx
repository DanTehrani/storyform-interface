import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Input,
  Text,
  Select
} from "@chakra-ui/react";
import IndexPageSkeleton from "../components/IndexPageSkeleton";
import { useAppDispatch, useAppSelector, useSignTypedDataV4 } from "../hooks";
import { submitAnswers } from "../state/formAnswersSlice";
import { getForm } from "../state/formSlice";
import { useRouter } from "next/router";
import { SIGNATURE_DOMAIN } from "../config";
import { useWeb3React } from "@web3-react/core";
import { poseidon } from "circomlibjs";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { groth16Prove } from "../lib/zksnark";

const PRIMARY_TYPE = "Submission";

const Form: NextPage = () => {
  const { query } = useRouter();
  const signTypedDataV4 = useSignTypedDataV4();
  const { account } = useWeb3React();
  const [displayPleaseFillWarning, setDisplayPleaseFillWarning] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();
  const gettingForm = useAppSelector(state => state.form.gettingForm);
  const submissionComplete = useAppSelector(
    state => state.formAnswers.submissionComplete
  );
  const form = useAppSelector(state => state.form.form);
  const [answers, setAnswers] = useState<string[]>([]);
  const questions = form.questions;
  const formId = query.f?.toString();

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
      if (account) {
        // Check local storage for the signature
        const message = {
          domain: SIGNATURE_DOMAIN,
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" }
            ],
            Submission: [
              {
                name: "message",
                type: "string"
              }
            ]
          },
          primaryType: PRIMARY_TYPE,
          message: {
            message: "Keep the signature safe! - StoryForm"
          }
        };

        const secret = poseidon([
          await signTypedDataV4(account, JSON.stringify(message))
        ]);
        const secretBI = BigInt(secret);
        const formIdBI = BigInt(`0x${formId}`);
        const identity = poseidon([secretBI]);
        const submissionId = poseidon([secretBI, formIdBI]);

        const tree = new IncrementalMerkleTree(poseidon, 3, BigInt(0), 2);
        tree.insert(identity);
        const merkleProof = tree.createProof(0);

        const proof = await groth16Prove({
          secret: secretBI,
          formId: formIdBI,
          submissionId,
          treePathIndices: merkleProof.pathIndices,
          treeSiblings: merkleProof.siblings.map(s => s[0]),
          merkleRoot: BigInt(tree.root)
        });

        dispatch(
          submitAnswers({
            //@ts-ignore
            formId,
            submissionId: submissionId.toString(),
            proof: JSON.stringify(proof, null, 0),
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
    <>
      <Box
        width="100%"
        height="50vh"
        display={"flex"}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box width="60%">
          <FormControl>
            {questions.map((question, i) => (
              <Box key={i} padding={4}>
                <FormLabel>
                  {question.label}
                  {question.required ? " *" : ""}
                </FormLabel>
                {question.type === "text" ? (
                  <Input
                    borderWidth={"0px 0px 2px 0px"}
                    borderRadius={0}
                    padding={"0px 0px 8px"}
                    variant="unstyled"
                    value={answers[i]}
                    onChange={e => {
                      handleInputChange(e.target.value, i);
                    }}
                    required={question.required}
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
          <Button mt={4} onClick={handleSubmitClick}>
            Sign and submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Form;
