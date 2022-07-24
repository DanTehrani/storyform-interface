import { configureStore } from "@reduxjs/toolkit";
import bookmarkReduce from "./state/bookmarkSlice";
import formReducer from "./state/formAnswersSlice";

const store = configureStore({
  reducer: {
    bookmark: bookmarkReduce,
    formAnswers: formReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
