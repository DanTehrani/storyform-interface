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
  Center,
  Link
} from "@chakra-ui/react";
import { FormQuestion } from "../types";

type Props = {
  title: string;
  description: string;
  questions: FormQuestion[];
  isSubmitDisabled: boolean;
  onSubmit: (answers: string[]) => void;
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

  const handleInputChange = async (value: string, inputIndex: number) => {
    const newValues = new Array(questions.length)
      .fill("")
      // eslint-disable-next-line security/detect-object-injection
      .map((_, i) => (i === inputIndex ? value : answers[i] || ""));

    setAnswers(newValues);
  };

  const handleSubmitClick = () => {
    onSubmit(answers);
  };

  return (
    <Container>
      <Heading size="md" mt={6}>
        {title}
      </Heading>
      <Text mt={4}>{description}</Text>
      <FormControl mt={4}>
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
                  ></Input>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </Box>
        ))}
      </FormControl>
      <ButtonGroup mt={4}>
        <Button onClick={handleSubmitClick} isDisabled={isSubmitDisabled}>
          Submit
        </Button>
      </ButtonGroup>
      <Center mt={4}>
        <Text as="i" color="blackAlpha.400">
          Made with&nbsp;
          <Link
            href={window.location.origin}
            isExternal
            textDecoration="underline"
          >
            Storyform
          </Link>
        </Text>
      </Center>
    </Container>
  );
};

export default Form;
