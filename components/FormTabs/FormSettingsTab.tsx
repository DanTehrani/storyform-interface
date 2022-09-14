import { useContext } from "react";
import { Stack, Button, Alert, AlertIcon } from "@chakra-ui/react";
import CreateFormContext from "../../contexts/CreateFormContext";
import EditFormContext from "../../contexts/EditFormContext";

type Props = {
  context: typeof CreateFormContext | typeof EditFormContext;
  onDeleteFormClick?: () => void; // Not required in form creation
};

// TBD
const FormSettingsTab: React.FC<Props> = ({ context, onDeleteFormClick }) => {
  // @ts-ignore
  const { formInput, updateSettings } = useContext(context);

  if (!formInput) {
    return <></>;
  }

  const { settings } = formInput;

  return (
    <Stack spacing={5}>
      {onDeleteFormClick ? ( // If onDeleteFormClick is defined, then we are in edit mode
        <>
          <Alert status="warning">
            <AlertIcon />
            Even after deletion, the survey itself and the responses will remain
            on Arweave. You can only remove the survey from rendering on
            interfaces.
          </Alert>
          <Button
            variant="outline"
            colorScheme="red"
            onClick={onDeleteFormClick}
          >
            Delete from
          </Button>
        </>
      ) : (
        <>Coming soon...</>
      )}
    </Stack>
  );
};

export default FormSettingsTab;
