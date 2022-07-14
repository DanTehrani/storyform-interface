import { useEffect } from "react";
import { Flex, Box, Center, Button, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import Card from "../components/Card";
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
  }, [dispatch]);

  if (gettingBookmarks) {
    return <IndexPageSkeleton></IndexPageSkeleton>;
  }

  if (!bookmarks.length) {
    return (
      <Flex align="center" justify="center" dir="row" height="70vh">
        <Box textAlign="center" py={10} px={6}>
          <Heading
            as="h2"
            size="xl"
            bgGradient="linear(to-r, teal.400, teal.600)"
            backgroundClip="text"
          >
            You don't have any bookmarks!
          </Heading>
          <Button size={"lg"} mt={6}>
            Explore
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Center>
      <Box w={[300, 1000]}>
        <Heading>My List</Heading>
        {bookmarks.map((bookmark: Bookmark, i) => (
          <Card bookmark={bookmark} key={i}></Card>
        ))}
      </Box>
    </Center>
  );
};

export default Home;
