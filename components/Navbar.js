import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Container,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useWallet } from "use-wallet";

import NextLink from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function NavBar() {
  const wallet = useWallet();

  return (
    <Box bg={'red'}>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        bgGradient='linear(to-l, #2C2C7B, #1CB5E0)'
        align={"center"}
        pos="fixed"
        top="0"
        w={"full"}
        minH={"60px"}
        boxShadow={"sm"}
        zIndex="999"
        justify={"center"}
        css={{
          backdropFilter: "saturate(180%) blur(5px)",
          // backgroundColor: useColorModeValue(
          //   "#162F44",
          //   "rgba(26, 32, 44, 0.8)"
          // ),
        }}
      >
        <Container as={Flex} maxW={"7xl"} align={"center"}>
          <Flex flex={{ base: 1 }} justify="start" ml={{ base: -2, md: 0 }}>
            <Heading
              textAlign="left"
              // fontFamily={"heading"}
              color={useColorModeValue("red", "white")}
              as="h2"
              size="lg"
            >
              <Box
                as={"span"}
                color={useColorModeValue("#fefefe", "teal.300")}
                position={"relative"}
                zIndex={10}
              >
                <NextLink href="/">CryptAid</NextLink>
              </Box>
            </Heading>
          </Flex>
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={20}
            display={{ base: "none", md: "flex" }}
          >
            {/* <Button
              fontSize={"md"}
              fontWeight={200}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={'white'}
            >
              <NextLink href="/campaign/new">Create Campaign</NextLink>
            </Button> */}
            <Button
              fontSize={"md"}
              fontWeight={200}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={'white'}    
            >
              <NextLink href="/explore">Explore</NextLink>
            </Button>
            <Button
              fontSize={"md"}
              fontWeight={200}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={'white'}
            >
              <NextLink href="/campaign/new">About</NextLink>
            </Button>
            {/* <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
            >
              <NextLink href="/#howitworks"> How it Works</NextLink>
            </Button> */}

            {wallet.status === "connected" ? (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {wallet.account.substr(0, 10) + "..."}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => wallet.reset()}>
                    {" "}
                    Disconnect Wallet{" "}
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <div>
                <Button
                  display={{ base: "none", md: "inline-flex" }}
                  fontSize={"md"}
                  fontWeight={600}
                  color={"black"}
                  bg={"#43B0F1"}
                  borderRadius={20}
                  href={"#"}
                  _hover={{
                    bg: "#0065A1",
                    color: "white"
                  }}
                  onClick={() => wallet.connect()}
                >
                  Connect Wallet{" "}
                </Button>
              </div>
            )}

            {/* <DarkModeSwitch /> */}
          </Stack>

          <Flex display={{ base: "flex", md: "none" }}>
            {/* <DarkModeSwitch /> */}
          </Flex>
        </Container>
      </Flex>
    </Box>
  );
}
