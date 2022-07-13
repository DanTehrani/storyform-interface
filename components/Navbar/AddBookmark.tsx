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
import { useAppDispatch } from "../../hooks";
import { addBookmark } from "../../state/bookmarkSlice";
import { useWeb3React } from "@web3-react/core";

const AddBookmark = () => {
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState<string>("");
  const { account } = useWeb3React();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleAddClick = () => {
    if (account) {
      dispatch(addBookmark({ account, bookmarkInput: { url } }));
      onClose();
    }
  };

  const handleInputChange = (e: any) => {
    setUrl(e.target.value);
  };

  return (
    <Popover matchWidth isOpen={isOpen} onOpen={onOpen}>
      <PopoverTrigger>
        <Button>Add</Button>
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
            <Button onClick={handleAddClick}>Add</Button>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AddBookmark;
