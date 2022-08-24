import { useContext } from "react";
import { Button, Center, Input, Stack } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import FormInputCard from "./FormInputCard";
import EditFormContext from "../contexts/EditFormContext";
import CreateFormContext from "../contexts/CreateFormContext";

type Props = {
  context: typeof CreateFormContext | typeof EditFormContext;
};

const FormQuestionsTab: React.FC<Props> = ({ context }) => {
  // @ts-ignore
  const { formInput, setFormInput } = useContext(context);

  if (!formInput) {
    return <></>;
  }

  const handleAddQuestionClick = () => {
    setFormInput({
      ...formInput,
      questions: [
        ...formInput.questions,
        {
          label: "",
          type: "text",
          customAttributes: []
        }
      ]
    });
  };
  const handleDeleteQuestionClick = (questionIndex: number) => {
    setFormInput({
      ...formInput,
      questions: formInput.questions.filter((_, i) => i !== questionIndex)
    });
  };

  const handleMoveQuestionUpClick = (questionIndex: number) => {
    if (questionIndex !== 0) {
      const { questions } = formInput;

      setFormInput({
        ...formInput,
        questions: questions.map((q, i) => {
          if (i === questionIndex - 1) {
            // eslint-disable-next-line security/detect-object-injection
            return questions[questionIndex];
          }

          if (i === questionIndex) {
            return questions[questionIndex - 1];
          }

          return q;
        })
      });
    }
  };

  const handleMoveQuestionDownClick = (questionIndex: number) => {
    const { questions } = formInput;
    if (questionIndex !== questions.length - 1) {
      setFormInput({
        ...formInput,
        questions: questions.map((q, i) => {
          if (i === questionIndex) {
            // eslint-disable-next-line security/detect-object-injection
            return questions[questionIndex + 1];
          }

          if (i - 1 === questionIndex) {
            // eslint-disable-next-line security/detect-object-injection
            return questions[questionIndex];
          }

          return q;
        })
      });
    }
  };

  const handleUpdate = (key: string, value: string) => {
    setFormInput({
      ...formInput,
      [key]: value
    });
  };

  return (
    <>
      <Input
        fontSize="2xl"
        mt={4}
        placeholder="Form title"
        value={formInput.title}
        onChange={e => {
          handleUpdate("title", e.target.value);
        }}
        variant="flushed"
      ></Input>
      <Input
        placeholder="Form description"
        value={formInput.description}
        onChange={e => {
          handleUpdate("description", e.target.value);
        }}
        variant="flushed"
        mt={6}
      ></Input>
      <Stack gap={4} mt={6}>
        {formInput.questions.map((formQuestion, i) => (
          <FormInputCard
            context={context}
            key={i}
            formQuestion={formQuestion}
            formQuestionIndex={i}
            deleteQuestion={() => {
              handleDeleteQuestionClick(i);
            }}
            moveQuestionUp={() => {
              handleMoveQuestionUpClick(i);
            }}
            moveQuestionDown={() => {
              handleMoveQuestionDownClick(i);
            }}
          ></FormInputCard>
        ))}
      </Stack>
      <Center mt={4}>
        <Button
          onClick={handleAddQuestionClick}
          leftIcon={<SmallAddIcon></SmallAddIcon>}
        >
          Add a question
        </Button>
      </Center>
    </>
  );
};

export default FormQuestionsTab;
