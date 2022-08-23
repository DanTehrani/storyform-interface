import { useContext } from "react";
import { Stack, Text, Input, Select } from "@chakra-ui/react";

const respondentCriteriaOptions = [
  {
    label: "Anyone",
    value: "ANYONE"
  }
  /*
  {
    label: "ERC721 token holders",
    value: "ERC721"
  }
  */
];

// TBD
const FormSettingsTab = ({ context }) => {
  const { formInput, updateSettings } = useContext(context);

  return (
    <Stack>
      <Text>Who can answer?</Text>
      <Select>
        {respondentCriteriaOptions.map((option, i) => (
          <option value={option.value} key={i}>
            {option.label}
          </option>
        ))}
      </Select>
      {formInput.settings.respondentCriteria === "ERC721" ? (
        <Input
          placeholder="ERC721 token address"
          onChange={e => {
            updateSettings({
              ...formInput.settings,
              erc721TokenAddress: e.target.value
            });
          }}
        ></Input>
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default FormSettingsTab;
