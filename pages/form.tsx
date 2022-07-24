import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Input,
  Text
} from "@chakra-ui/react";
import IndexPageSkeleton from "../components/IndexPageSkeleton";
import { motion, useAnimationControls } from "framer-motion";
import { FormQuestion } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addAnswer, submitAnswers } from "../state/formAnswersSlice";
import { getForm } from "../state/formSlice";

const Form = () => {
  const [formQuestionIndex, setFormQuestionIndex] = useState<number>(0);
  const [formInput, setFormInput] = useState<string | number>(""); // Text or index

  const controls = useAnimationControls();
  const dispatch = useAppDispatch();
  const gettingForm = useAppSelector(state => state.form.gettingForm);
  const form = useAppSelector(state => state.form.form);
  const answers = useAppSelector(state => state.formAnswers.answers);
  const questions = form.questions;

  useEffect(() => {
    dispatch(
      getForm({
        formId: ""
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const formQuestionsLoaded = !questions.length;
    if (formQuestionsLoaded && answers.length === questions.length) {
      // All answers have been added, meaning "Submit" has been clicked
      dispatch(submitAnswers());
    }
  }, [answers, dispatch, questions.length]);

  if (gettingForm) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

  const questionsComplete = formQuestionIndex >= questions.length;
  const isLastQuestion = formQuestionIndex === questions.length - 1;

  if (questionsComplete) {
    return (
      <Box>
        <Text>Thank you for answering our questions. Your answers:</Text>
        {answers.map(({ answer }) => answer)}
      </Box>
    );
  }

  const handleNextClick = async () => {
    // Animate: fade out then fade in
    await controls.start({
      y: [0, -100],
      opacity: 0,
      transition: {
        type: "spring",
        duration: 0.5
      }
    });

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
  const currentFormQuestion = questions[formQuestionIndex];

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
