import { useState } from "react";
import {
  Container,
  Box,
  ButtonGroup,
  Select,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FormQuestion } from "../types";
import { notEmpty } from "../utils";
import MadeWithStoryForm from "./MadeWithStoryForm";

type Props = {
  title: string;
  description: string;
  questions: FormQuestion[];
  isSubmitDisabled: boolean;
  onSubmit: (answers: string[]) => void;
};

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

const Form: React.FC<Props> = ({
  title,
  description,
  questions,
  isSubmitDisabled,
  onSubmit
}) => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const toast = useToast();

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

  const handleSubmitClick = () => {
    onSubmit(answers);
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
            <Button onClick={handleSubmitClick} isDisabled={isSubmitDisabled}>
              Submit
            </Button>
          </ButtonGroup>
        </Box>
        <MadeWithStoryForm></MadeWithStoryForm>
      </Container>
    );
  }

  return (
    <Container>
      <Heading size="md" mt={6}>
        {title}
      </Heading>
      <Text mt={4}>{description}</Text>
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
        <Button onClick={handleNextClick} isDisabled={isSubmitDisabled}>
          Next
        </Button>
      </ButtonGroup>
      <MadeWithStoryForm></MadeWithStoryForm>
    </Container>
  );
};

export default Form;
