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
import { FormContext } from "../types";
import { CheckIcon } from "@chakra-ui/icons";

const StyledCircularProgress = () => (
  <CircularProgress size={5} isIndeterminate color="purple.300" />
);

const StyledCheckIcon = () => <CheckIcon color="purple.300"></CheckIcon>;

type Props = {
  isOpen: boolean;
  generatingProof: boolean;
  submittingForm: boolean;
  formContext: FormContext;
};

const SubmittingFormModal = ({
  isOpen,
  generatingProof,
  submittingForm,
  formContext
}: Props) => {
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
                {formContext ? <Text>匿名信頼性証明を作成中</Text> : <></>}
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
