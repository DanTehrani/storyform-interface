import { Link, Button } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { getFormResponsesUrl } from "../../utils";

type Props = {
  formId: string;
};

const FormResponsesTab: React.FC<Props> = ({ formId }) => {
  return (
    <Button
      rightIcon={<ExternalLinkIcon></ExternalLinkIcon>}
      onClick={() => {
        window.open(getFormResponsesUrl(formId));
      }}
    >
      View Responses
    </Button>
  );
};

export default FormResponsesTab;
