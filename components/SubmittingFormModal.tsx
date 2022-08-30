import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  CircularProgress,
  HStack,
  VStack
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

const StyledCircularProgress = () => (
  <CircularProgress size={5} isIndeterminate color="purple.300" />
);

const StyledCheckIcon = () => <CheckIcon color="purple.300"></CheckIcon>;

type Props = {
  isOpen: boolean;
  submittingForm: boolean;
};

const SubmittingFormModal = ({ isOpen, submittingForm }: Props) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          // Do nothing
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <VStack align="left">
              <HStack>
                {submittingForm ? (
                  <>
                    <StyledCircularProgress></StyledCircularProgress>
                    <Text>Submitting your answer</Text>
                  </>
                ) : (
                  <>
                    <StyledCheckIcon></StyledCheckIcon>
                    <Text>Submitting your answer</Text>
                  </>
                )}
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubmittingFormModal;
