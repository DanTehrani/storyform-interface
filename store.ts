import { configureStore } from "@reduxjs/toolkit";
import formAnswersReducer from "./state/formAnswersSlice";
import formReducer from "./state/formSlice";

const store = configureStore({
  reducer: {
    formAnswers: formAnswersReducer,
    form: formReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
