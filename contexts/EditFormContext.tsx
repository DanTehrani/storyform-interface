import { createContext, useCallback, useState } from "react";
import {
  FormInput,
  FormQuestion,
  FormSettings,
  IEditFormContext
} from "../types";
import { getForm as _getForm } from "../lib/form";

const defaultState = {
  formInput: null,
  setFormInput: () => null,
  updateQuestion: () => null,
  updateSettings: () => null,
  getForm: () => null,
  formNotFound: false,
  gettingForm: false
};

const EditFormContext = createContext<IEditFormContext>(defaultState);

export const EditFormContextProvider = ({ children }) => {
  const [formInput, setFormInput] = useState<FormInput | null>();
  const [formNotFound, setFormNotFound] = useState<boolean>(false);

  const updateQuestion = useCallback(
    (question: FormQuestion, questionIndex) => {
      setFormInput(
        _formInput =>
          _formInput && {
            ..._formInput,
            questions: _formInput.questions.map((q, i) =>
              i === questionIndex ? question : q
            )
          }
      );
    },
    [setFormInput]
  );

  const updateSettings = useCallback(
    (settings: FormSettings) => {
      setFormInput(
        _formInput =>
          _formInput && {
            ..._formInput,
            settings
          }
      );
    },
    [setFormInput]
  );

  const getForm = useCallback(async (formId: string) => {
    const _form = await _getForm(formId);
    if (_form) {
      setFormInput({
        title: _form.title,
        questions: _form.questions,
        settings: _form.settings || {}
      });
    } else {
      setFormNotFound(true);
    }
  }, []);

  return (
    <EditFormContext.Provider
      value={{
        formInput,
        setFormInput,
        updateQuestion,
        updateSettings,
        getForm,
        formNotFound
      }}
    >
      {children}
    </EditFormContext.Provider>
  );
};

export default EditFormContext;
