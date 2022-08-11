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
import useTranslation from "next-translate/useTranslation";

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
  const { t } = useTranslation("Form");
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
              {formContext.requireZkMembershipProof ? (
                <HStack>
                  {generatingProof ? (
                    <StyledCircularProgress></StyledCircularProgress>
                  ) : (
                    <StyledCheckIcon></StyledCheckIcon>
                  )}
                  <Text>{t("generating-zk-proof")}</Text>
                </HStack>
              ) : (
                <></>
              )}
              <HStack>
                {generatingProof ? (
                  <></>
                ) : submittingForm ? (
                  <>
                    <StyledCircularProgress></StyledCircularProgress>
                    <Text>{t("submitting")}</Text>
                  </>
                ) : (
                  <>
                    <StyledCheckIcon></StyledCheckIcon>
                    <Text>{t("submitting")}</Text>
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
