import { useContext } from "react";
import { Button, Center, Input, Stack } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import FormInputCard from "../../components/FormInputCard";
import CreateFormContext from "../../contexts/CreateFormContext";

const FormQuestionsTab = () => {
  const { formInput, setFormInput } = useContext(CreateFormContext);

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

  const handleTitleUpdate = (value: string) => {
    setFormInput({
      ...formInput,
      title: value
    });
  };

  return (
    <>
      <Input
        size="lg"
        mt={4}
        placeholder="Title of your form"
        value={formInput.title}
        onChange={e => {
          handleTitleUpdate(e.target.value);
        }}
        variant="flushed"
      ></Input>
      <Stack gap={4} mt={4}>
        {formInput.questions.map((formQuestion, i) => (
          <FormInputCard
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
