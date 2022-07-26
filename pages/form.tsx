import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Input,
  Text,
  HStack
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import IndexPageSkeleton from "../components/IndexPageSkeleton";
import { motion, useAnimationControls } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addAnswer, submitAnswers } from "../state/formAnswersSlice";
import { getForm } from "../state/formSlice";

const animationType = "tween";
const animateTopToCenter = {
  y: [-100, 0],
  opacity: 1,
  transition: {
    type: animationType,
    duration: 0.5
  }
};

const animateCenterToBottom = {
  y: [0, 100],
  opacity: 0,
  transition: {
    type: animationType,
    duration: 0.5
  }
};

const animateCenterToTop = {
  transition: {
    type: animationType,
    duration: 0.5
  },
  y: [0, -100],
  opacity: 0
};

const animateBottomToCenter = {
  transition: {
    type: animationType,
    duration: 0.5
  },
  y: [100, 0],
  opacity: 1
};

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
  const isFirstQuestion = formQuestionIndex === 0;
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
    await controls.start(animateCenterToTop);

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

    await controls.start(animateBottomToCenter);
  };

  const handleInputChange = async e => {
    setFormInput(e.target.value);
  };

  const handlePreviousQuestionClick = async () => {
    await controls.start(animateCenterToBottom);

    setFormQuestionIndex(Math.max(formQuestionIndex - 1, 0));

    await controls.start(animateTopToCenter);
  };

  const handleNextQuestionClick = async () => {
    await controls.start(animateCenterToTop);

    setFormQuestionIndex(formQuestionIndex + 1);

    await controls.start(animateBottomToCenter);
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
          <FormLabel>
            {currentFormQuestion.label}
            {currentFormQuestion.required ? " *" : ""}
          </FormLabel>
          <Input
            borderWidth={"0px 0px 2px 0px"}
            borderRadius={0}
            padding={"0px 0px 8px"}
            variant="unstyled"
            value={formInput}
            onChange={handleInputChange}
            required={currentFormQuestion.required}
          ></Input>
        </FormControl>
        <Button mt={4} onClick={handleNextClick}>
          {isLastQuestion ? "Submit" : "Next"}
        </Button>
      </Box>
      <HStack
        position="absolute"
        bottom={0}
        right={0}
        width="100%"
        justify="flex-end"
        padding="0px 180px 0px 0px"
      >
        <IconButton
          disabled={isFirstQuestion}
          aria-label="To previous question"
          icon={<ChevronUpIcon></ChevronUpIcon>}
          onClick={handlePreviousQuestionClick}
        ></IconButton>
        <IconButton
          disabled={isLastQuestion}
          aria-label="To next question"
          icon={<ChevronDownIcon></ChevronDownIcon>}
          onClick={handleNextQuestionClick}
        ></IconButton>
      </HStack>
    </Box>
  );
};

export default Form;
