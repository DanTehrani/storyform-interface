import { useContext } from "react";
import {
  Stack,
  Button,
  Alert,
  AlertIcon,
  Checkbox,
  Box,
  Tooltip,
  Text
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
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
        <Stack>
          <Text as="i">Anonymous survey</Text>

          <Checkbox
            isChecked={settings.devcon6}
            onChange={e => {
              updateSettings({
                ...settings,
                devcon6: e.target.checked
              });
            }}
          >
            Only Devcon6 POAP holders can answer &nbsp;
            <Tooltip label="The Ethereum address of the respondent won't be revealed.">
              <InfoIcon color="purple.300"></InfoIcon>
            </Tooltip>
          </Checkbox>
          <Text as="i">
            This is an experiment feature that. Please do not use this feature
            for critical manners.
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export default FormSettingsTab;
