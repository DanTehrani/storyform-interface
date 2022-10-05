import { Alert, AlertTitle } from "@chakra-ui/react";
const Devcon6CampaignBanner = () => {
  return (
    <Alert status="success" flexDirection="column">
      <AlertTitle as="i">Devcon6 Campaign!</AlertTitle>
      You can create surveys that allow Devcon6 POAP holders to respond
      anonymously. Got to the settings tab to enable this feature.
    </Alert>
  );
};

export default Devcon6CampaignBanner;
