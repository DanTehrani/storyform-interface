import { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Grid,
  Stack,
  Text,
  Image,
  GridItem,
  Center,
  Skeleton
} from "@chakra-ui/react";
import { PoapEvent } from "../lib/poap/poap.types";
import CreateFormContext from "../contexts/CreateFormContext";

const EventCard: React.FC<{
  event: PoapEvent;
  onSelect: (eventId: number) => void;
}> = ({ event, onSelect }) => {
  return (
    <Stack>
      <Center>
        <Text as="b">{event.title}</Text>
      </Center>
      <Image src={event.rawMetadata.image_url}></Image>
      <Button
        onClick={() => {
          onSelect(event.id);
        }}
      >
        Select
      </Button>
    </Stack>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SelectPoapEventModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { poapEvents, updateSettings, formInput } =
    useContext(CreateFormContext);
  const { settings } = formInput;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      preserveScrollBarGap
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid
            templateColumns={["repeat(1, 1fr)", "repeat(4, 1fr)"]}
            gap={12}
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            {!poapEvents.length
              ? new Array(8).fill(0).map(i => (
                  <GridItem key={i}>
                    <Skeleton height="200px" />
                  </GridItem>
                ))
              : poapEvents.map(event => {
                  return (
                    <GridItem key={event.id}>
                      <EventCard
                        event={event}
                        onSelect={eventId => {
                          updateSettings({
                            ...settings,
                            poapEventId: eventId
                          });
                          onClose();
                        }}
                      ></EventCard>
                    </GridItem>
                  );
                })}
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectPoapEventModal;
