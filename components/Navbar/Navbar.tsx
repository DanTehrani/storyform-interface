import {
  Box,
  Flex,
  IconButton,
  Collapse,
  Link,
  Button,
  Text,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useAccount, useDisconnect } from "wagmi";
import ConnectWalletButton from "../ConnectWalletButton";

const NAV_ITEMS = [
  {
    label: "フォーム一覧",
    url: "/forms"
  }
];

const StyledLink = props => {
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
          <Text display={{ base: "none", md: "flex" }}>ZK Survey</Text>
          <Box ml={4} display={{ base: "none", md: "flex" }} p="4px" gap={1}>
            {NAV_ITEMS.map(({ label, url, external }, i) => (
              <StyledLink key={i} href={url} isExternal={external}>
                <Text>{label}</Text>
              </StyledLink>
            ))}
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
              <ConnectWalletButton></ConnectWalletButton>
            )}
          </Box>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        {NAV_ITEMS.map(({ label, url, external }, i) => (
          <Box p={4} display={{ md: "none" }} key={i}>
            <StyledLink href={url} isExternal={external}>
              {label}
            </StyledLink>
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

export default Navbar;
