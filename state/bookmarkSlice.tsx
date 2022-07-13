import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as bookmark from "../lib/bookmark";
import { Bookmark, BookmarkInput } from "../types";

export const getBookmarks = createAsyncThunk(
  "bookmark/getBookmarks",
  async () => {
    const bookmarks = await bookmark.getBookmarks();
    return bookmarks;
  }
);
export const addBookmark = createAsyncThunk(
  "bookmark/addBookmark",
  async ({
    account,
    bookmarkInput
  }: {
    account: string;
    bookmarkInput: BookmarkInput;
  }) => {
    await bookmark.addBookmark(account, bookmarkInput);
  }
);

type IInitialState = {
  bookmarks: Bookmark[];
  gettingBookmarks: boolean;
};

const initialState: IInitialState = {
  bookmarks: [],
  gettingBookmarks: false
};

export const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder.addCase(getBookmarks.pending, (state, action) => {
      state.gettingBookmarks = true;
    });

    builder.addCase(getBookmarks.fulfilled, (state, action) => {
      state.bookmarks = action.payload;
      state.gettingBookmarks = false;
    });
  }
});

export const actions = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
