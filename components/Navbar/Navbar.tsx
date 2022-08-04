import {
  chakra,
  Box,
  Flex,
  IconButton,
  Collapse,
  Link,
  Button,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const StyledLink = props => {
  const linkHoverColor = useColorModeValue("gray.800", "white");

  return (
    <Link
      {...props}
      _hover=""
      fontSize={"sm"}
      fontWeight={500}
      p={2}
      color={useColorModeValue("gray.600", "gray.200")}
    ></Link>
  );
};

const getShortenAddress = (account: string) =>
  `${account.slice(0, 6)}...${account.slice(7, 11)}`;

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();

  const { connect } = useConnect({
    connector: new InjectedConnector()
  });
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Box>
      <Flex
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        align={"center"}
        justify="space-between"
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex justify={{ base: "center", md: "start" }} align="center">
          <Box display={{ base: "none", md: "flex" }}>
            <StyledLink
              href="https://github.com/DanTehrani/story-interface"
              isExternal
            >
              GitHub
            </StyledLink>
            <StyledLink href="/forms">Forms</StyledLink>
          </Box>
        </Flex>
        <Flex>
          <Box>
            {isConnected ? (
              <Button
                onClick={() => {
                  disconnect();
                }}
              >
                {address && getShortenAddress(address)}
              </Button>
            ) : (
              <Button
                bgColor={"orange"}
                onClick={() => {
                  connect();
                }}
              >
                Connect
              </Button>
            )}
          </Box>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box p={4} display={{ md: "none" }}>
          <StyledLink
            href="https://github.com/DanTehrani/story-interface"
            isExternal
          >
            GitHub
          </StyledLink>
        </Box>
        <Box p={4} display={{ md: "none" }}>
          <StyledLink href="/forms">Forms</StyledLink>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Navbar;
