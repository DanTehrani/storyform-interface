import { createAsyncThunk, createSlice } from "@reduxjs/toolkit/";
import { getForm as _getForm } from "../lib/form";

import { Form } from "../types";

type IInitialState = {
  gettingForm: boolean;
  form: Form;
  formNotFound: boolean;
};

const initialState: IInitialState = {
  gettingForm: true,
  form: {
    title: "",
    owner: "",
    version: "",
    questions: [],
    id: ""
  },
  formNotFound: false
};

export const getForm = createAsyncThunk(
  "form/get",
  async ({ formId }: { formId: string }): Promise<Form | null> => {
    // Fetch form information from Arweave.
    // Check the signature of the form
    // If not valid, tell the user that the form is not valid.
    const form = await _getForm(formId);

    return form;
  }
);

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getForm.pending, state => ({
      ...state,
      gettingForm: true
    }));

    builder.addCase(getForm.fulfilled, (state, action) => ({
      ...state,
      form: action.payload || state.form,
      formNotFound: state.form === null,
      gettingForm: false
    }));
  }
});

export default formSlice.reducer;
