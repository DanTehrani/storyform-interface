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
  formOwner: null,
  formNotFound: false,
  gettingForm: false,
  formStatus: null
};

const EditFormContext = createContext<IEditFormContext>(defaultState);

export const EditFormContextProvider = ({ children }) => {
  const [formInput, setFormInput] = useState<FormInput | null>();
  const [formNotFound, setFormNotFound] = useState<boolean>(false);
  const [formOwner, setFormOwner] = useState<string | null>();
  const [formStatus, setFormStatus] = useState<string | null>();

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
      // Be backward compatible. Set default values of new settings here.
      setFormInput({
        title: _form.title,
        description: _form.description || "",
        questions: _form.questions,
        settings: _form.settings || {}
      });

      setFormOwner(_form.owner);
      setFormStatus(_form.status);
    } else {
      setFormNotFound(true);
    }
  }, []);

  return (
    <EditFormContext.Provider
      value={{
        formOwner,
        formStatus,
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
