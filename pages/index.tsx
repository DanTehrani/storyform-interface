import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Input,
  Text,
  HStack,
  Select,
  FormHelperText
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import IndexPageSkeleton from "../components/IndexPageSkeleton";
import { motion, useAnimationControls } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addAnswer, submitAnswers } from "../state/formAnswersSlice";
import { getForm } from "../state/formSlice";
import { useRouter } from "next/router";

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

const Home: NextPage = () => {
  const { query } = useRouter();
  const [formQuestionIndex, setFormQuestionIndex] = useState<number>(0);
  const [formInput, setFormInput] = useState<string | number>(""); // Text or index
  const [displayPleaseFillWarning, setDisplayPleaseFillWarning] =
    useState<boolean>(false);

  const controls = useAnimationControls();
  const dispatch = useAppDispatch();
  const gettingForm = useAppSelector(state => state.form.gettingForm);
  const form = useAppSelector(state => state.form.form);
  const answers = useAppSelector(state => state.formAnswers.answers);
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

  const emptyRequiredFields = questions.map(({ required }, i) => ({
    questionIndex: i,
    empty: !answers.find(({ questionIndex }) => questionIndex === i) && required
  }));

  const nonAnsweredFieldsExist = emptyRequiredFields.filter(
    ({ empty }) => empty
  );

  const questionsComplete =
    !nonAnsweredFieldsExist && formQuestionIndex >= questions.length;
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
    if (isLastQuestion && nonAnsweredFieldsExist) {
      setFormQuestionIndex(
        // @ts-ignore At least one is empty
        emptyRequiredFields.find(({ empty }) => empty)?.questionIndex
      );
      setDisplayPleaseFillWarning(true);
    } else {
      setDisplayPleaseFillWarning(false);
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
    }
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
    <>
      <HStack width="100%" justify="flex-end">
        <Text fontSize="xl" as="i">
          {formQuestionIndex + 1 + "/" + questions.length}
        </Text>
      </HStack>
      <Box
        width="100%"
        height="50vh"
        display={"flex"}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          as={motion.div}
          initial={{
            x: 0
          }}
          animate={controls}
          width="60%"
        >
          <FormControl id={formQuestionIndex.toString()}>
            <FormLabel fontSize="xl" mb={3}>
              {currentFormQuestion.label}
              {currentFormQuestion.required ? " *" : ""}
            </FormLabel>
            {currentFormQuestion.type === "text" ? (
              <Input
                borderWidth={"0px 0px 2px 0px"}
                borderRadius={0}
                padding={"0px 0px 8px"}
                variant="unstyled"
                value={formInput}
                onChange={handleInputChange}
                required={currentFormQuestion.required}
              ></Input>
            ) : currentFormQuestion.type === "select" ? (
              <Select
                placeholder={currentFormQuestion.label}
                size="lg"
                variant="outline"
                // @ts-ignore
                value={currentFormQuestion.options[0]}
              >
                {currentFormQuestion.options?.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : (
              <></>
            )}

            {displayPleaseFillWarning ? (
              <FormHelperText>Please fill this field</FormHelperText>
            ) : (
              <></>
            )}
          </FormControl>
          <Button mt={4} onClick={handleNextClick}>
            {isLastQuestion ? "Sign and submit" : "Next"}
          </Button>
        </Box>
      </Box>
      <HStack
        // position="absolute"
        // bottom={0}
        right={0}
        width="100%"
        justify="flex-end"
        // padding="0px 180px 0px 0px"
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
    </>
  );
};

export default Home;
