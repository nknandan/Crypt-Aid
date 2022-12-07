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
import DarkModeSwitch from "./DarkModeSwitch";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useWallet } from "use-wallet";
import Campaign from "../smart-contract/campaign";
import factory from "../smart-contract/factory";
import SearchTable from "./SearchTable";
import { useUser } from "@auth0/nextjs-auth0";

var cName2Id = {};

export default function NavBar() {
  const wallet = useWallet();
  const [campaignList, setCampaignList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setsearchData] = useState([]);
  const { user, isLoading, error } = useUser();
  const [userMenu, setUserMenu] = useState(0);
  const [searchMenu, setSearchMenu] = useState(0);
  const ref = useRef();
  useOutsideClick({
    ref: ref,
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
    // console.log("HELLLO");
    // console.log(data);
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

  useEffect(() => {
    if (user != null || user != undefined) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("email", user.email);
    }
  }, [user]);

  return (
    <Box>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
        pos="fixed"
        top="0"
        w={"full"}
        minH={"60px"}
        maxH={"60px"}
        boxShadow={"2xl"}
        zIndex="1000"
        css={{
          backdropFilter: "saturate(180%) blur(5px)",
        }}
      >
        <Flex as={Flex} align={"center"} w={"100vw"} px={"10%"} justifyContent={"space-between"}>
          <Flex>
            <Heading
              textAlign="left"
              // fontFamily={"heading"}
              color={useColorModeValue("red", "white")}
              as="h2"
              size="lg"
            >
              <Box as={"span"} color={useColorModeValue("#fefefe", "teal.300")} position={"relative"} zIndex={10}>
                <NextLink href="/">CryptAid</NextLink>
              </Box>
            </Heading>
          </Flex>
          <Stack direction={"row"} gap={20}>
            <Flex
              backgroundColor={"gray.100"}
              width={"30vw"}
              borderRadius={10}
              alignContent={"center"}
              alignItems={"center"}
            >
              <InputGroup w={"100%"} border={"0px"}>
                <Input
                  type="string"
                  border={"0px"}
                  placeholder={"Search for campaigns"}
                  onChange={(e) => {
                    setSearchQuery(e.target.value.toLowerCase());
                    setSearchMenu(1);
                  }}
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
              {searchMenu ? (
                <Flex
                  borderBottom={1}
                  borderLeft={1}
                  borderRight={1}
                  borderStyle={"solid"}
                  borderColor={"blue.400"}
                  bgColor={"white"}
                  w={"30vw"}
                  maxH={"40vh"}
                  overflowY={"auto"}
                  pos={"absolute"}
                  top={"60px"}
                  boxShadow={"sm"}
                  zIndex="999"
                  // justify={"center"}
                  paddingLeft={"10px"}
                  py={0}
                  borderBottomRadius={10}
                  ref={ref}
                >
                  {<SearchTable searchData={search(campaignList)} mapping={cName2Id} ref={ref} />}
                </Flex>
              ) : (
                <></>
              )}
            </Flex>
            <Button
              fontSize={"md"}
              fontWeight={200}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={"white"}
            >
              <NextLink href="/explore">Explore</NextLink>
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

            {user ? (
              <Button
                fontSize={"md"}
                fontWeight={600}
                color={"black"}
                bg={"#43B0F1"}
                borderRadius={20}
                width={150}
                href={"#"}
                display={"flex"}
                justifyContent={"flex-start"}
                _hover={{
                  bg: "#0065A1",
                  color: "white",
                }}
                p={0}
                onClick={() => {
                  setUserMenu(!userMenu);
                }}
              >
                <Img height={10} borderRadius={"50%"} src={user.picture} />
                <Text ml={3}>{user.nickname}</Text>
              </Button>
            ) : (
              <Button
                fontSize={"md"}
                fontWeight={600}
                color={"black"}
                bg={"#43B0F1"}
                borderRadius={20}
                width={150}
                href={"#"}
                _hover={{
                  bg: "#0065A1",
                  color: "white",
                }}
                p={0}
              >
                <NextLink href="/api/auth/login">Login</NextLink>
              </Button>
            )}

            {/* <DarkModeSwitch /> */}
          </Stack>

          {/* <Flex display={{ base: "flex", md: "none" }}>
            <DarkModeSwitch />
          </Flex> */}
        </Flex>
      </Flex>

      {userMenu ? (
        <Flex
          position={"fixed"}
          top={"60px"}
          right={"60px"}
          w={"20vw"}
          bgColor={"gray.300"}
          p={5}
          zIndex={9999}
          flexDirection={"column"}
          borderBottomRadius={10}
          ref={ref}
        >
          <Center>
            <Img borderRadius={"50%"} height={20} src={user.picture} />
            <Center flexDirection={"column"} maxW={"70%"} justifyContent={"center"} ml={5}>
              {/* Above ml={2} */}
              <Text fontSize={25} fontWeight={400} alignSelf={"flex-start"}>
                {user.nickname}
              </Text>
              <Text alignSelf={"flex-start"}>{user.name}</Text>
              {/* <Button borderColor={"blue.300"} borderWidth={1} mt={2} borderRadius={20} alignSelf={"flex-start"}>
                <NextLink href="/api/auth/logout">Manage your account</NextLink>
              </Button> */}
              <NextLink href="/userProfile">
                <a>
                  <Text
                    fontWeight={600}
                    as="u"
                    color={"blue.800"}
                    onClick={() => {
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
