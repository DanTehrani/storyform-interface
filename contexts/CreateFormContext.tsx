import { createContext, useCallback, useState } from "react";
import {
  FormInput,
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
      requireEthereumWallet: false,
      requireZkMembershipProof: false
    }
  },
  setFormInput: () => null,
  updateQuestion: () => null,
  updateSettings: () => null
};

const CreateFormContext = createContext<ICreateFormContext>(defaultState);

export const CreateFormContextProvider = ({ children }) => {
  const [formInput, setFormInput] = useState<FormInput>(defaultState.formInput);

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
      value={{ formInput, setFormInput, updateQuestion, updateSettings }}
    >
      {children}
    </CreateFormContext.Provider>
  );
};

export default CreateFormContext;
