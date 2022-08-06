import { configureStore } from "@reduxjs/toolkit";
import formAnswersReducer from "./state/formAnswersSlice";

const store = configureStore({
  reducer: {
    formAnswers: formAnswersReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
