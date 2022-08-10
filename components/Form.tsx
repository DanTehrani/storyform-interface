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
  Input
} from "@chakra-ui/react";
import ConnectWalletButton from "./ConnectWalletButton";
import { useAccount } from "wagmi";
import useTranslation from "next-translate/useTranslation";
import { FormQuestion } from "../types";

type Props = {
  title: string;
  questions: FormQuestion[];
  isSubmitDisabled: boolean;
  onSubmit: (answers: string[]) => void;
};

const Form: React.FC<Props> = ({
  title,
  questions,
  isSubmitDisabled,
  onSubmit
}) => {
  const { isConnected } = useAccount();
  const [answers, setAnswers] = useState<string[]>([]);
  const { t } = useTranslation();

  const handleInputChange = async (value: string, inputIndex: number) => {
    const newValues = new Array(questions.length)
      .fill("")
      .map((_, i) => (i === inputIndex ? value : answers[i] || ""));

    setAnswers(newValues);
  };

  const handleSubmitClick = () => {
    onSubmit(answers);
  };

  return (
    <Container>
      <Heading size="md" mb={3} mt={6}>
        {title}
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
        <Button onClick={handleSubmitClick} isDisabled={isSubmitDisabled}>
          {t("submit")}
        </Button>
        {!isConnected ? <ConnectWalletButton></ConnectWalletButton> : <></>}
      </ButtonGroup>
    </Container>
  );
};

export default Form;
