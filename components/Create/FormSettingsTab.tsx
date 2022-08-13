import { useContext } from "react";
import { Stack, Checkbox } from "@chakra-ui/react";
import CreateFormContext from "../../contexts/CreateFormContext";

const FormSettingsTab = () => {
  const { formInput, updateSettings } = useContext(CreateFormContext);

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
