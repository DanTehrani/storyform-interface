import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Input,
  HStack,
  useDisclosure
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addBookmark, getBookmarks } from "../../state/bookmarkSlice";
import { useWeb3React } from "@web3-react/core";

const AddBookmarkPopover = () => {
  const { isOpen, onToggle } = useDisclosure();
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState<string>("");
  const { account } = useWeb3React();
  const addingBookmark = useAppSelector(state => state.bookmark.addingBookmark);

  const handleAddClick = async () => {
    if (account) {
      await dispatch(addBookmark({ account, bookmarkInput: { url } }));
      dispatch(getBookmarks());
      onToggle();
    }
  };

  const handleInputChange = (e: any) => {
    setUrl(e.target.value);
  };

  return (
    <Popover isOpen={isOpen} onOpen={onToggle} onClose={onToggle}>
      <PopoverTrigger>
        <Button> {isOpen ? <SmallCloseIcon></SmallCloseIcon> : "Add"}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <HStack>
            <Input
              placeholder="url"
              type="text"
              onChange={handleInputChange}
            ></Input>
            <Button onClick={handleAddClick} isLoading={addingBookmark}>
              Add
            </Button>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AddBookmarkPopover;
