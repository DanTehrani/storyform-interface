import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { FormAnswer } from "../types";
import { submitAnswer } from "../lib/gateway";

type IInitialState = {
  answers: FormAnswer[];
  submittingAnswers: boolean;
  proof: string | null;
  submissionId: string | null;
  formId: string | null;
};

const initialState: IInitialState = {
  answers: [],
  submittingAnswers: false,
  proof: null,
  submissionId: null,
  formId: null
};

export const submitAnswers = createAsyncThunk(
  "formAnswers/submit",
  async (_, { getState }) => {
    const state = getState();
    // @ts-ignore
    const answers = state.answers.map(({ answer }) => answer);
    // @ts-ignore
    const { proof, formId, submissionId, signature, hash } = state;

    const formSubmission = {
      answers,
      proof,
      formId,
      submissionId,
      signature,
      hash
    };

    await submitAnswer(formSubmission);
    /**
     * Create signature
     * Create Arweave tx (upload answers)
     * Generate & submit proof
     */
  }
);

const formAnswersSlice = createSlice({
  name: "formAnswers",
  initialState,
  reducers: {
    addAnswer: (state, action: PayloadAction<FormAnswer>) => ({
      ...state,
      answers: [...state.answers, action.payload]
    })
  },
  extraReducers: builder => {
    builder.addCase(submitAnswers.pending, state => ({
      ...state,
      submittingAnswers: true
    }));
  }
});

export const { addAnswer } = formAnswersSlice.actions;
export default formAnswersSlice.reducer;
