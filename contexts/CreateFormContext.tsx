import { createContext, useState } from "react";
import {
  CreateFormInput,
  FormQuestion,
  FormSettings,
  ICreateFormContext
} from "../types";

const defaultState = {
  formInput: {
    title: "",
    questions: [
      {
        label: "",
        type: "text",
        customAttributes: []
      }
    ],
    settings: {
      requireEthereumWallet: false
    }
  },
  setFormInput: () => null,
  updateQuestion: () => null,
  updateSettings: () => null
};

const CreateFormContext = createContext<ICreateFormContext>(defaultState);

export const CreateFormContextProvider = ({ children }) => {
  const [formInput, setFormInput] = useState<CreateFormInput>(
    defaultState.formInput
  );

  const updateQuestion = (question: FormQuestion, questionIndex) => {
    setFormInput({
      ...formInput,
      questions: formInput.questions.map((q, i) =>
        i === questionIndex ? question : q
      )
    });
  };

  const updateSettings = (settings: FormSettings) => {
    setFormInput({
      ...formInput,
      settings
    });
  };

  return (
    <CreateFormContext.Provider
      value={{ formInput, setFormInput, updateQuestion, updateSettings }}
    >
      {children}
    </CreateFormContext.Provider>
  );
};

export default CreateFormContext;
