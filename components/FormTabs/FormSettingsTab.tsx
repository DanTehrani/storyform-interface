import { useState, useContext } from "react";
import {
  Stack,
  Button,
  Alert,
  AlertIcon,
  Checkbox,
  Select,
  Tooltip,
  Text,
  Box,
  Image
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import CreateFormContext from "../../contexts/CreateFormContext";
import EditFormContext from "../../contexts/EditFormContext";
import SelectPoapEventModal from "../SelectPoapEventModal";

type Props = {
  context: typeof CreateFormContext | typeof EditFormContext;
  onDeleteFormClick?: () => void; // Not required in form creation
};

// TBD
const FormSettingsTab: React.FC<Props> = ({ context, onDeleteFormClick }) => {
  // @ts-ignore
  const { formInput, updateSettings, poapEvents } = useContext(context);

  const [selectPoapModalOpen, setSelectPoapModalOpen] =
    useState<boolean>(false);

  if (!formInput) {
    return <></>;
  }

  const { settings } = formInput;
  const selectedPoap = poapEvents.find(e => e.id === settings.poapEventId);

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
          <Checkbox
            isChecked={settings.gatedAnon}
            onChange={e => {
              updateSettings({
                ...settings,
                gatedAnon: e.target.checked
              });
            }}
          >
            Only POAP holders can answer &nbsp;
            <Tooltip label="The Ethereum address of the respondent won't be revealed.">
              <InfoIcon color="purple.300"></InfoIcon>
            </Tooltip>
          </Checkbox>
          <Button onClick={() => setSelectPoapModalOpen(true)}>
            Select POAP
          </Button>
          {selectedPoap ? (
            <Box>
              <Image src={selectedPoap?.rawMetadata.image_url}></Image>
              <Text as="b">Only {selectedPoap.title} can answer</Text>
            </Box>
          ) : (
            <> </>
          )}
          <Text as="i">
            This is an experiment feature that. Please do not use this feature
            for critical manners.
          </Text>
        </Stack>
      )}
      <SelectPoapEventModal
        isOpen={selectPoapModalOpen}
        onClose={() => setSelectPoapModalOpen(false)}
      ></SelectPoapEventModal>
    </Stack>
  );
};

export default FormSettingsTab;
