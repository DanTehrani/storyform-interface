import { createAsyncThunk, createSlice } from "@reduxjs/toolkit/";
import { Form } from "../types";

type IInitialState = {
  gettingForm: boolean;
  form: Form;
};

const initialState: IInitialState = {
  gettingForm: true,
  form: {
    title: "",
    owner: "",
    version: "",
    questions: [],
    id: ""
  }
};

export const getForm = createAsyncThunk(
  "form/get",
  async ({ formId }: { formId: string }): Promise<Form> => {
    // Fetch form information from Arweave.

    const form = {
      id: formId,
      title: "My form",
      version: "1",
      owner: "0x0000",
      questions: [
        {
          label: "first question",
          type: "text",
          required: false,
          customerAttributes: []
        },
        {
          label: "second question",
          type: "text",
          required: false,
          customerAttributes: []
        }
      ]
    };
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
      form: action.payload,
      gettingForm: false
    }));
  }
});

export default formSlice.reducer;
