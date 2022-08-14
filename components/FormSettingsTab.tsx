import { useContext } from "react";
import { Stack, Checkbox } from "@chakra-ui/react";

const FormSettingsTab = ({ context }) => {
  const { formInput, updateSettings } = useContext(context);

  return (
    <Stack>
      <Checkbox
        onChange={e => {
          updateSettings({
            ...formInput.settings,
            requireEthereumWallet: e.target.checked
          });
        }}
        isChecked={formInput.settings.requireEthereumWallet}
      >
        Require Ethereum wallet sign in
      </Checkbox>
    </Stack>
  );
};

export default FormSettingsTab;
