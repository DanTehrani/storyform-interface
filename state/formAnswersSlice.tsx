import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { FormAnswer, FormSubmission, FormSubmissionInput } from "../types";
import {
  submitAnswer,
  getSubmissions as _getSubmissions
} from "../lib/formSubmission";

type IInitialState = {
  answers: FormAnswer[]; // Delete this.
  submittingAnswers: boolean;
  submissionComplete: boolean;
  gettingSubmissions: boolean;
  fetchedSubmission: FormSubmission[];
};

const initialState: IInitialState = {
  answers: [],
  submittingAnswers: false,
  submissionComplete: false,
  gettingSubmissions: false,
  fetchedSubmission: []
};

export const submitAnswers = createAsyncThunk(
  "formAnswers/submit",
  async (formSubmission: FormSubmissionInput) => {
    await submitAnswer(formSubmission);
  }
);

export const getSubmissions = createAsyncThunk(
  "formAnswers/get",
  async (options: { first: number; after?: string }) => {
    return await _getSubmissions(options);
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

    builder.addCase(getSubmissions.pending, state => ({
      ...state,
      gettingSubmissions: true
    }));

    builder.addCase(getSubmissions.fulfilled, (state, action) => ({
      ...state,
      fetchedSubmission: action.payload,
      gettingSubmissions: false
    }));
  }
});

export const { addAnswer } = formAnswersSlice.actions;
export default formAnswersSlice.reducer;
