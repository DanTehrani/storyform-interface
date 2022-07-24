import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Input,
  Text
} from "@chakra-ui/react";
import { motion, useAnimationControls } from "framer-motion";
import { FormQuestion } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addAnswer, submitAnswers } from "../state/formAnswersSlice";

const formQuestions: FormQuestion[] = [
  {
    label: "hello",
    type: "text"
  },
  {
    label: "hello",
    type: "text"
  }
];

const Form = () => {
  const [formQuestionIndex, setFormQuestionIndex] = useState<number>(0);
  const [formInput, setFormInput] = useState<string | number>(""); // Text or index

  const questionsComplete = formQuestionIndex >= formQuestions.length;
  const isLastQuestion = formQuestionIndex === formQuestions.length - 1;
  const controls = useAnimationControls();
  const dispatch = useAppDispatch();
  const answers = useAppSelector(state => state.formAnswers.answers);

  useEffect(() => {
    const formQuestionsLoaded = formQuestions.length > 0;
    if (formQuestionsLoaded && answers.length === formQuestions.length) {
      // All answers have been added, meaning "Submit" has been clicked
      dispatch(submitAnswers());
    }
  }, [answers, dispatch]);

  if (questionsComplete) {
    return (
      <Box>
        <Text>Thank you for answering our questions</Text>
      </Box>
    );
  }

  const handleNextClick = async () => {
    dispatch(
      addAnswer({
        questionIndex: formQuestionIndex,
        answer: formInput
      })
    );

    // Clear form input
    setFormInput("");

    // Submit answers

    setFormQuestionIndex(formQuestionIndex + 1);

    // Animate: fade out then fade in
    await controls.start({
      y: [0, -100],
      opacity: 0,
      transition: {
        type: "spring",
        duration: 0.5
      }
    });

    await controls.start({
      transition: {
        type: "spring",
        duration: 0.3
      },
      y: [100, 0],
      opacity: 1
    });
  };

  const handleInputChange = async e => {
    setFormInput(e.target.value);
  };

  // eslint-disable-next-line security/detect-object-injection
  const currentFormQuestion = formQuestions[formQuestionIndex];

  return (
    <Box
      width="100%"
      height="50vh"
      display={"flex"}
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        as={motion.div}
        initial={{
          x: 0
        }}
        animate={controls}
        width="80%"
      >
        <FormControl id={formQuestionIndex.toString()}>
          <FormLabel>{currentFormQuestion.label}</FormLabel>
          <Input
            borderWidth={"0px 0px 2px 0px"}
            borderRadius={0}
            padding={"0px 0px 8px"}
            variant="unstyled"
            value={formInput}
            onChange={handleInputChange}
          ></Input>
        </FormControl>
        <Button mt={4} onClick={handleNextClick}>
          {isLastQuestion ? "Submit" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default Form;
