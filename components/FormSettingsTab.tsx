import { useContext } from "react";
import { Stack, Text, Input, Select, Checkbox, Box } from "@chakra-ui/react";
import CreateFormContext from "../contexts/CreateFormContext";
import EditFormContext from "../contexts/EditFormContext";

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
      <Box>
        <Text fontSize="lg" mb={1}>
          Encryption
        </Text>
        <Checkbox
          disabled
          onChange={e => {
            updateSettings({
              ...settings,
              encryptAnswers: e.target.checked
            });
          }}
          isChecked={settings.encryptAnswers}
        >
          Encrypt answers
        </Checkbox>
      </Box>
      <hr />
      <Box>
        <Text fontSize="lg" mb={1}>
          Who can answer?
        </Text>
        <Select disabled>
          {respondentCriteriaOptions.map((option, i) => (
            <option value={option.value} key={i}>
              {option.label}
            </option>
          ))}
        </Select>
        {settings.respondentCriteria === "ERC721" ? (
          <Input
            placeholder="ERC721 token address"
            onChange={e => {
              updateSettings({
                ...settings,
                erc721TokenAddress: e.target.value
              });
            }}
          ></Input>
        ) : (
          <></>
        )}
      </Box>
      <hr />
    </Stack>
  );
};

export default FormSettingsTab;
