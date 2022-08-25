import { useEffect } from "react";
import {
  Stack,
  useClipboard,
  useToast,
  Input,
  IconButton,
  Text
} from "@chakra-ui/react";
import { CopyIcon, LinkIcon } from "@chakra-ui/icons";
import { getFormUrl } from "../utils";

type Props = {
  formId: string;
};

const FormShareTab: React.FC<Props> = ({ formId }) => {
  const url = getFormUrl(formId);
  const { hasCopied, onCopy } = useClipboard(url);
  const toast = useToast();

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: "Copied link!",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    }
  }, [hasCopied, toast]);

  return (
    <Stack spacing={5}>
      <Stack direction="row" alignItems="center">
        <LinkIcon></LinkIcon>
        <Text>Get the link</Text>
      </Stack>
      <Stack direction="row">
        <Input isReadOnly variant="filled" value={url}></Input>
        <IconButton
          aria-label="Copy form url"
          icon={<CopyIcon></CopyIcon>}
          onClick={onCopy}
        ></IconButton>
      </Stack>
    </Stack>
  );
};

export default FormShareTab;
