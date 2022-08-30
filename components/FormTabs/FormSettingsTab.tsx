import { useContext } from "react";
import { Stack, Text } from "@chakra-ui/react";
import CreateFormContext from "../../contexts/CreateFormContext";
import EditFormContext from "../../contexts/EditFormContext";

type Props = {
  context: typeof CreateFormContext | typeof EditFormContext;
};

// TBD
const FormSettingsTab: React.FC<Props> = ({ context }) => {
  // @ts-ignore
  const { formInput, updateSettings } = useContext(context);

  if (!formInput) {
    return <></>;
  }

  const { settings } = formInput;

  return (
    <Stack spacing={5}>
      <Text as="i">Coming soon...</Text>
    </Stack>
  );
};

export default FormSettingsTab;
