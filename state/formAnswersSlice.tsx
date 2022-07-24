import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { FormAnswer } from "../types";

type IInitialState = {
  answers: FormAnswer[];
  submittingAnswers: boolean;
};

const initialState: IInitialState = {
  answers: [],
  submittingAnswers: false
};

export const submitAnswers = createAsyncThunk(
  "formAnswers/submit",
  async (_, { getState }) => {
    const state = getState();
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
