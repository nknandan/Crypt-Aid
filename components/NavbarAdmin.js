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
  InputGroup,
  Input,
  Img,
  useOutsideClick,
  MenuItem,
  Center,
} from "@chakra-ui/react";

import { useEffect, useState, useRef } from "react";
import NextLink from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useWallet } from "use-wallet";
import Campaign from "../smart-contract/campaign";
import factory from "../smart-contract/factory";
import SearchTable from "./SearchTable";
import { useUser } from "@auth0/nextjs-auth0";

var cName2Id = {};

export default function NavbarAdmin() {
  const wallet = useWallet();
  const [campaignList, setCampaignList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setsearchData] = useState([]);
  const { user, isLoading, error } = useUser();
  const [userMenu, setUserMenu] = useState(0);
  const [searchMenu, setSearchMenu] = useState(0);
  const refs = useRef();
  useOutsideClick({
    ref: refs,
    handler: () => {
      setUserMenu(0);
      setSearchMenu(0);
      console.log(searchMenu);
    },
  });

  const getCampaigns = async () => {
    try {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      const summary = await Promise.all(
        campaigns.map((campaign, i) => Campaign(campaigns[i]).methods.getSummary().call())
      );
      setCampaignList(summary);
      let i = 0;
      for (let ele of campaigns) {
        cName2Id[summary[i]["5"]] = ele;
        i++;
      }
      return summary;
    } catch (e) {
      console.log(e);
    }
  };

  const search = (data) => {
    data = data.filter((item) => {
      if (searchQuery == "") return false;
      if (item["5"].toLowerCase().includes(searchQuery) || item["6"].toLowerCase().includes(searchQuery)) {
        return true;
      } else {
        return false;
      }
    });
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCampaigns();
    };
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
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
        }}
      >
        <Container as={Flex} maxW={"7xl"} align={"center"}>
          <Flex flex={{ base: 1 }} justify="start">
            <Heading textAlign="left" color={useColorModeValue("red", "white")} as="h2" size="lg">
              <Box
                as={"span"}
                color={useColorModeValue("#fefefe", "teal.300")}
                position={"relative"}
                zIndex={10}
                ml={-100}
                mr={0}
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
            <Flex
              backgroundColor={"gray.100"}
              width={"30vw"}
              borderRadius={10}
              alignContent={"center"}
              alignItems={"center"}
            >
              <InputGroup w={"90%"} border={"0px"}>
                <Input
                  type="string"
                  border={"0px"}
                  placeholder={"Search for campaigns"}
                  onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                />
              </InputGroup>

              <Button
                bg={"#43B0F1"}
                borderRadius={0}
                href={"#"}
                _hover={{
                  bg: "#0065A1",
                  color: "white",
                }}
                width={"10%"}
                borderRightRadius={10}
              >
                <Img position={"absolute"} height={"60%"} objectFit={"contain"} src={"/search.png"} />
              </Button>
            </Flex>
            <Button
              fontSize={"md"}
              fontWeight={200}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={"white"}
            >
              <NextLink href="/explore">Campaigns</NextLink>
            </Button>
            <Button
              fontSize={"md"}
              fontWeight={200}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={"white"}
            >
              <NextLink href="/explore">Communities</NextLink>
            </Button>
            <Button
              fontSize={"md"}
              fontWeight={200}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={"white"}
            >
              <NextLink href="/about">About</NextLink>
            </Button>
            <Button
              fontSize={"md"}
              fontWeight={"bold"}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={"black"}
              onClick={() => {
                console.log("Debug Now.");
                console.log(campaignList);
                localStorage.setItem("adminAuth", "false");
              }}
              bgColor={"blue.300"}
              padding={10}
              py={0}
              borderRadius={35}
            >
              <NextLink href="/" color="black">
                Logout
              </NextLink>
            </Button>
          </Stack>
        </Container>
      </Flex>

      <Flex
        borderBottom={1}
        borderLeft={1}
        borderRight={1}
        borderStyle={"solid"}
        borderColor={"blue.400"}
        bgColor={"white"}
        pos="fixed"
        w={"30vw"}
        top="59px"
        left={"29vw"}
        boxShadow={"sm"}
        zIndex="999"
        paddingLeft={"20px"}
        py={0}
        borderBottomRadius={10}
      >
        {<SearchTable searchData={search(campaignList)} mapping={cName2Id} />}
        {/* Below one unnecessarily using refs */}
        {/* {<SearchTable searchData={search(campaignList)} mapping={cName2Id} ref={refs} />} */}
      </Flex>

      {userMenu ? (
        <Flex
          position={"fixed"}
          top={"59px"}
          right={"2vw"}
          w={"20vw"}
          bgColor={"gray.300"}
          p={5}
          zIndex={9999}
          flexDirection={"column"}
          borderBottomRadius={10}
          // ! ref={refs} ???
        >
          <Center>
            <Img borderRadius={"50%"} height={20} src={user.picture} />
            <Center flexDirection={"column"} maxW={"70%"} justifyContent={"center"} ml={5}>
              <Text fontSize={25} fontWeight={400} alignSelf={"flex-start"}>
                {user.nickname}
              </Text>
              <Text alignSelf={"flex-start"}>{user.name}</Text>
              <NextLink href="/userProfile">
                <a>
                  <Text
                    fontWeight={600}
                    as="u"
                    color={"blue.800"}
                    onClick={() => {
                      localStorage.setItem("user", JSON.stringify(user));
                      localStorage.setItem("email", user.email);
                      setUserMenu(!userMenu);
                    }}
                  >
                    Manage your account
                  </Text>
                </a>
              </NextLink>
            </Center>
          </Center>
          {wallet.status == "connected" ? (
            <Center mt={5} borderTopWidth={1} borderColor={"black"} pt={5}>
              <Menu>
                <MenuButton
                  w={40}
                  borderRadius={20}
                  borderColor={"blue.300"}
                  borderWidth={1}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  {wallet.account.substr(0, 9) + "..."}
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      wallet.reset();
                      setUserMenu(!userMenu);
                    }}
                  >
                    {" "}
                    Disconnect Wallet{" "}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Center>
          ) : (
            <div>
              <Center mt={5} borderTopWidth={1} borderColor={"black"} pt={5}>
                <Button
                  w={40}
                  borderColor={"blue.300"}
                  borderWidth={1}
                  borderRadius={20}
                  href={"#"}
                  onClick={() => {
                    wallet.connect();
                    setUserMenu(!userMenu);
                  }}
                >
                  <Center>
                    <Text>Connect wallet</Text>
                  </Center>
                </Button>
              </Center>
            </div>
          )}
          <Center mt={5} borderTopWidth={1} borderColor={"black"}>
            <Button
              w={40}
              borderColor={"blue.300"}
              borderWidth={1}
              mt={5}
              borderRadius={20}
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("email");
                setUserMenu(!userMenu);
              }}
            >
              <NextLink href="/api/auth/logout">Logout</NextLink>
            </Button>
          </Center>
        </Flex>
      ) : (
        <></>
      )}
    </Box>
  );
}
