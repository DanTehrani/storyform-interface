import { createContext } from "react";

export const FormContext = createContext({});

export const FormProvider = props => {
  return (
    <FormContext.Provider value={{}}>{props.children}</FormContext.Provider>
  );
};
