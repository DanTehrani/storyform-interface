import { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack
} from "@chakra-ui/react";
import { useConnect } from "wagmi";
import ConnectWalletModalContext from "../contexts/ConnectWalletModalContext";

const StyledButton = ({ label, onClick }) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      bgImage="radial-gradient( circle farthest-corner at 10% 20%,  rgba(111,111,219,1) 0%, rgba(182,109,246,1) 72.4% );"
      color="white"
    >
      {label}
    </Button>
  );
};

const ConnectWalletModal = () => {
  const { isOpen, close } = useContext(ConnectWalletModalContext);
  const { connectAsync, connectors } = useConnect();
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        close();
      }}
      isCentered
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent padding={4}>
        <ModalCloseButton></ModalCloseButton>
        <ModalBody>
          <VStack>
            {connectors.map((connector, i) => (
              <StyledButton
                key={i}
                label={connector.name}
                onClick={async () => {
                  await connectAsync({ connector });
                  close();
                }}
              ></StyledButton>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConnectWalletModal;
