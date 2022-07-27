import {
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
import { injected } from "../../lib/wallet";
import { useWeb3React } from "@web3-react/core";

const getShortenAddress = (account: string) =>
  `${account.slice(0, 6)}...${account.slice(7, 11)}`;

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");

  const { activate, active, account, deactivate } = useWeb3React();

  const connect = async () => {
    await activate(injected);
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
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
            <Link
              p={2}
              href="https://github.com/DanTehrani/story-interface"
              isExternal
              fontSize={"sm"}
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: "none",
                color: linkHoverColor
              }}
            >
              GitHub
            </Link>
          </Box>
        </Flex>
        <Flex>
          <Box>
            {active ? (
              <Button onClick={deactivate}>
                {account && getShortenAddress(account)}
              </Button>
            ) : (
              <Button bgColor={"orange"} onClick={connect}>
                Connect
              </Button>
            )}
          </Box>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box p={4} display={{ md: "none" }}>
          <Link
            fontWeight={600}
            color={useColorModeValue("gray.600", "gray.200")}
            href="https://github.com/DanTehrani/story-interface"
            isExternal
          >
            GitHub
          </Link>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Navbar;
