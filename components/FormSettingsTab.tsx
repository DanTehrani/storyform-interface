import { useContext } from "react";
import { Stack, Checkbox, Input, Select } from "@chakra-ui/react";

const membershipOptions = [
  {
    label: "Own a specific ERC721 token",
    value: "erc721"
  }
];

const FormSettingsTab = ({ context }) => {
  const { formInput, updateSettings } = useContext(context);

  return (
    <Stack>
      <Checkbox
        onChange={e => {
          updateSettings({
            ...formInput.settings,
            requireZkMembershipProof: e.target.checked
          });
        }}
        isChecked={true || formInput.settings.requireZkMembershipProof}
        disabled
      >
        Require membership proof
      </Checkbox>
      <Select>
        {membershipOptions.map((option, i) => (
          <option value={option.value} key={i}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input
        placeholder="ERC721 token address"
        onChange={e => {
          updateSettings({
            ...formInput.settings,
            erc721TokenAddress: e.target.value
          });
        }}
      ></Input>
    </Stack>
  );
};

export default FormSettingsTab;
