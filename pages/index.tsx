import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import type { NextPage } from "next";
import Card from "../components/Card";
import { Link, Container, Grid, GridItem } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getBookmarks } from "../state/bookmarkSlice";
import { Bookmark } from "../types";
import IndexPageSkeleton from "../components/IndexPageSkeleton";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector(state => state.bookmark.bookmarks);
  const gettingBookmarks = useAppSelector(
    state => state.bookmark.gettingBookmarks
  );

  useEffect(() => {
    dispatch(getBookmarks());
  }, []);

  if (gettingBookmarks) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

  return (
    <>
      {bookmarks.map((bookmark: Bookmark, i) => (
        <Card bookmark={bookmark} key={i}></Card>
      ))}
    </>
  );
};

export default Home;
