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

const SubmittingFormModal = ({ isOpen, generatingProof, submittingForm }) => {
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
                {generatingProof ? (
                  <StyledCircularProgress></StyledCircularProgress>
                ) : (
                  <StyledCheckIcon></StyledCheckIcon>
                )}
                <Text>匿名信頼性証明を作成中</Text>
              </HStack>
              <HStack>
                {generatingProof ? (
                  <></>
                ) : submittingForm ? (
                  <>
                    <StyledCircularProgress></StyledCircularProgress>
                    <Text>回答を送信中</Text>
                  </>
                ) : (
                  <>
                    <StyledCheckIcon></StyledCheckIcon>
                    <Text>回答を送信中</Text>
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
