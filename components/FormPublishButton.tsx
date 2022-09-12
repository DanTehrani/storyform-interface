import { useCallback, useContext } from "react";
import { Button, useToast } from "@chakra-ui/react";
import CreateFormContext from "../contexts/CreateFormContext";
import EditFormContext from "../contexts/EditFormContext";
import { FormQuestion } from "../types";

const questionWithEmptyLabelExist = (questions: FormQuestion[]): boolean =>
  questions.some(question => !question.label);

const selectQuestionWithNoOptionsExist = (questions: FormQuestion[]): boolean =>
  questions.some(
    question => question.type === "select" && question?.options?.length === 0
  );

const selectQuestionWithEmptyOptionExist = (
  questions: FormQuestion[]
): boolean =>
  questions.some(
    question =>
      question.type === "select" &&
      question?.options?.some(option => option === "")
  );

type Props = {
  context: typeof CreateFormContext | typeof EditFormContext;
  buttonLabel: string;
  isLoading: boolean;
  onClick: () => void;
};

const FormPublishButton: React.FC<Props> = ({
  context,
  buttonLabel,
  onClick
}) => {
  // @ts-ignore
  const { formInput } = useContext(context);

  const toast = useToast();

  const handlePublishClick = useCallback(() => {
    if (formInput) {
      const { title, questions } = formInput;

      if (!title) {
        toast({
          title: "Please enter a title",
          status: "warning",
          duration: 5000,
          isClosable: true
        });
      } else if (questions.length < 1) {
        toast({
          title: "Please add at least one question",
          status: "warning",
          duration: 5000,
          isClosable: true
        });
      } else if (questionWithEmptyLabelExist(questions)) {
        toast({
          title: "Please enter labels for all questions",
          status: "warning",
          duration: 5000,
          isClosable: true
        });
      } else if (selectQuestionWithNoOptionsExist(questions)) {
        toast({
          title: "Please enter options for all select questions",
          status: "warning",
          duration: 5000,
          isClosable: true
        });
      } else if (selectQuestionWithEmptyOptionExist(questions)) {
        toast({
          title: "Please enter option values for all select questions",
          status: "warning",
          duration: 5000,
          isClosable: true
        });
      } else {
        onClick();
      }
    }
  }, [formInput, onClick, toast]);

  return (
    <Button variant="solid" colorScheme="teal" onClick={handlePublishClick}>
      {buttonLabel}
    </Button>
  );
};

export default FormPublishButton;
