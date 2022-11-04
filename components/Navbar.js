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
  Center,
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

export default function NavBar() {
  const wallet = useWallet();
  const [campaignList, setCampaignList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setsearchData] = useState([]);
  const { user, isLoading, error } = useUser();
  const [userMenu, setUserMenu] = useState(0);
  console.log(user);

  const getCampaigns = async () => {
    try {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      const summary = await Promise.all(
        campaigns.map((campaign, i) => Campaign(campaigns[i]).methods.getSummary().call())
      );
      setCampaignList(summary);
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
              <Box as={"span"} color={useColorModeValue("#fefefe", "teal.300")} position={"relative"} zIndex={10}>
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
                  <MenuItem onClick={() => wallet.reset()}> Disconnect Wallet </MenuItem>
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
                  <Img position={"absolute"} height={"60%"} objectFit={"contain"} src={"/walleticon.png"} />
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
                justifyContent={"space-between"}
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
                <Text mr={4}>{user.nickname}</Text>
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

          <Flex display={{ base: "flex", md: "none" }}>{/* <DarkModeSwitch /> */}</Flex>
        </Container>
      </Flex>
      {userMenu ? (
        <Flex
          position={"fixed"}
          top={"59px"}
          right={20}
          w={"17%"}
          bgColor={"gray.300"}
          p={5}
          zIndex={9999}
          flexDirection={"column"}
          borderBottomRadius={10}
        >
          <Center>
            <Img borderRadius={"50%"} height={20} src={user.picture} />
            <Center flexDirection={"column"} maxW={"70%"} justifyContent={"center"} ml={5}>
              {/* Above ml={2} */}
              <Text fontSize={25} fontWeight={400} alignSelf={"flex-start"}>
                {user.nickname}
              </Text>
              <Text alignSelf={"flex-start"}>{user.name}</Text>
              <Button borderColor={"blue.300"} borderWidth={1} mt={2} borderRadius={20} alignSelf={"flex-start"}>
                <NextLink href="/api/auth/logout">Manage your account</NextLink>
              </Button>
            </Center>
          </Center>
          <Center mt={5} borderTopWidth={1} borderColor={"black"}>
            <Button w={40} borderColor={"blue.300"} borderWidth={1} mt={5} borderRadius={20}>
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
