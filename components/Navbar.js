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
  MenuItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { useWallet } from "use-wallet";

import Campaign from "../smart-contract/campaign";
import factory from "../smart-contract/factory";
import SearchTable from "./searchTable";
import { useUser } from "@auth0/nextjs-auth0";

const keys = ["5", "6"];

export default function NavBar() {
  const wallet = useWallet();
  const [campaignList, setCampaignList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setsearchData] = useState([]);
  const { user, isLoading, error } = useUser();

  const getCampaigns = async () => {
    try {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      const summary = await Promise.all(
        campaigns.map((campaign, i) =>
          Campaign(campaigns[i]).methods.getSummary().call()
        )
      );
      setCampaignList(summary);
      return summary;
    } catch (e) {
      console.log(e);
    }
  };

  const search = (data) => {
    // console.log(data);
    // console.log("STILL");
    data = data.filter((item) => {
      console.log(item["5"]);
      if (searchQuery == "") return false;
      if (
        item["5"].toLowerCase().includes(searchQuery) ||
        item["6"].toLowerCase().includes(searchQuery)
      ) {
        // console.log("TRUE");
        return true;
      } else {
        return false;
      }
    });
    console.log("IN SEARCH");
    console.log(data);
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCampaigns();
    };
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box bg={"red"}>
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
            <Flex
              backgroundColor={"gray.100"}
              width={"30vw"}
              borderRadius={10}
              alignContent={"center"}
              alignItems={"center"}
            >
              {/* TODO  */}
              <InputGroup w={"90%"} border={"0px"}>
                <Input
                  type="string"
                  border={"0px"}
                  placeholder={"Search for campaigns"}
                  onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                />
                {/* <ul className="list">
                  {search(campaignList).map((user) => (
                    <li className="listItem" key={user.id}>
                      {user["5"]}
                    </li>
                  ))}
                </ul> */}
                {<SearchTable searchData={search(campaignList)} />}
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
                onClick={() => wallet.connect()}
              >
                <Img
                  position={"absolute"}
                  height={"60%"}
                  objectFit={"contain"}
                  src={"/search.png"}
                />
              </Button>
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
                  {wallet.account.substr(0, 4) + "..."}
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
                    color: "white",
                  }}
                  onClick={() => wallet.connect()}
                >
                  <Img
                    position={"absolute"}
                    height={"60%"}
                    objectFit={"contain"}
                    src={"/walleticon.png"}
                  />
                </Button>
              </div>
            )}
            {/* 

             */}

            <Button
              onClick={() => {
                console.log("Debug Now.");
                console.log(campaignList);
              }}
            >
              DEBUG
            </Button>

            {/* 


                 */}
            <Button
              display={{ base: "none", md: "inline-flex" }}
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
            >
              {user ? (
                <>
                  <NextLink href="/api/auth/logout">Logout</NextLink>
                </>
              ) : (
                <NextLink href="/api/auth/login">Login</NextLink>
              )}
            </Button>

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
