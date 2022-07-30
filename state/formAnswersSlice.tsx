import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { FormAnswer, FormSubmission } from "../types";
import { submitAnswer } from "../lib/gateway";

type IInitialState = {
  answers: FormAnswer[];
  submittingAnswers: boolean;
  submissionComplete: boolean;
};

const initialState: IInitialState = {
  answers: [],
  submittingAnswers: false,
  submissionComplete: false
};

export const submitAnswers = createAsyncThunk(
  "formAnswers/submit",
  async (formSubmission: FormSubmission) => {
    await submitAnswer(formSubmission);
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

    builder.addCase(submitAnswers.fulfilled, state => ({
      ...state,
      submittingAnswers: false,
      submissionComplete: true
    }));
  }
});

export const { addAnswer } = formAnswersSlice.actions;
export default formAnswersSlice.reducer;
