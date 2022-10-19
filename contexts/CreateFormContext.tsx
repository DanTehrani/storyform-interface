import { createContext, useCallback, useEffect, useState } from "react";
import { usePoapEvents } from "../lib/poap/poap.hooks";
import {
  FormInput,
  FormQuestion,
  FormSettings,
  ICreateFormContext
} from "../types";

const defaultState = {
  formInput: {
    title: "",
    description: "",
    questions: [
      {
        label: "",
        type: "text"
      }
    ],
    settings: {
      gatedAnon: false
    }
  },
  setFormInput: () => null,
  updateQuestion: () => null,
  updateSettings: () => null,
  poapEvents: []
};

const CreateFormContext = createContext<ICreateFormContext>(defaultState);

export const CreateFormContextProvider = ({ children }) => {
  const [formInputRestored, setFormInputRestored] = useState<boolean>(false);
  const [formInput, setFormInput] = useState<FormInput>(defaultState.formInput);
  const { events } = usePoapEvents();

  // Save changes to localStorage (as the form's draft)
  // But don't until the currently stored localStorage values are restored.
  useEffect(() => {
    if (formInputRestored) {
      localStorage.setItem("formInput", JSON.stringify(formInput));
    }
  }, [formInput, formInputRestored]);

  // Restore localStorage values
  useEffect(() => {
    const formInput = localStorage.getItem("formInput");
    if (formInput) {
      setFormInput(JSON.parse(formInput));
    }

    setFormInputRestored(true);
  }, []);

  const updateQuestion = useCallback(
    (question: FormQuestion, questionIndex) => {
      setFormInput(_formInput => ({
        ..._formInput,
        questions: _formInput.questions.map((q, i) =>
          i === questionIndex ? question : q
        )
      }));
    },
    [setFormInput]
  );

  const updateSettings = useCallback(
    (settings: FormSettings) => {
      setFormInput(_formInput => ({
        ..._formInput,
        settings
      }));
    },
    [setFormInput]
  );

  return (
    <CreateFormContext.Provider
      value={{
        formInput,
        setFormInput,
        updateQuestion,
        updateSettings,
        poapEvents: events
      }}
    >
      {children}
    </CreateFormContext.Provider>
  );
};

export default CreateFormContext;
