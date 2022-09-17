import {
  Box,
  Flex,
  IconButton,
  Collapse,
  Link,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useDisclosure,
  Image
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useAccount, useDisconnect } from "wagmi";
import ConnectWalletButton from "../ConnectWalletButton";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { useRouter } from "next/router";

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
  `${account.slice(0, 6)}...${account.slice(37, account.length)}`;

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { pathname } = useRouter();

  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const NAV_ITEMS = [
    {
      label: "Create a form",
      url: "/create"
    }
  ];

  // Don't show the NavBar in the form submission page
  if (pathname === "/forms/[formId]") {
    return <></>;
  }

  return (
    <Box backgroundImage="radial-gradient( circle farthest-corner at 10% 20%,  rgba(111,111,219,1) 0%, rgba(182,109,246,1) 72.4% );">
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
          <Link
            href="/"
            _hover={{
              textDecoration: "none"
            }}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <Image src="/storyform.svg" width="70px" ml={-5}></Image>
            <Text
              display={{ base: "none", md: "flex" }}
              fontWeight={600}
              ml={-3}
            >
              Storyform
            </Text>
          </Link>
          <Box ml={5} display={{ base: "none", md: "flex" }} gap={1}>
            {NAV_ITEMS.map(({ label, url }, i) => (
              <StyledLink key={i} href={url}>
                <Text color="blackAlpha.700">{label}</Text>
              </StyledLink>
            ))}
          </Box>
        </Flex>
        <Flex>
          {address ? (
            <StyledLink
              href="/user/forms"
              display={{ base: "none", md: "block" }}
              mr={4}
            >
              <Text color="blackAlpha.700">Your forms</Text>
            </StyledLink>
          ) : (
            <></>
          )}
          <Box mr={4}>
            {address ? (
              <Button
                variant="outline"
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
          <Box>
            <Menu>
              <MenuButton
                bgColor="transparent"
                _active={{
                  bgColor: "transparent"
                }}
                _hover={{
                  bgColor: "transparent"
                }}
                as={IconButton}
                icon={<HamburgerIcon />}
              ></MenuButton>
              <MenuList>
                <MenuItem display={{ base: "block", md: "none" }} mb={3}>
                  <Link href="/user/forms">Your forms</Link>
                </MenuItem>
                <Flex
                  width="100%"
                  justifyContent="space-evenly"
                  mt={2}
                  mb={2}
                  gap={2}
                  pl={4}
                >
                  <Link href="https://twitter.com/storyform_xyz" isExternal>
                    <FaTwitter size={20}></FaTwitter>
                  </Link>
                  <Link href="https://discord.gg/6HezQVqX" isExternal>
                    <FaDiscord size={20}></FaDiscord>
                  </Link>
                  <Link
                    href="https://github.com/DanTehrani/storyform-interface"
                    isExternal
                  >
                    <FaGithub size={20}></FaGithub>
                  </Link>
                </Flex>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        {NAV_ITEMS.map(({ label, url }, i) => (
          <Box p={4} display={{ md: "none" }} key={i}>
            <StyledLink href={url} color="black">
              {label}
            </StyledLink>
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

export default Navbar;
