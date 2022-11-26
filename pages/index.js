import Head from "next/head";
import React from "react";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { getETHPrice, getWEIPriceInUSD } from "../lib/getETHPrice";
import {
  Heading,
  useBreakpointValue,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Container,
  SimpleGrid,
  Box,
  Divider,
  Skeleton,
  Img,
  Icon,
  chakra,
  Tooltip,
  Link,
  SkeletonCircle,
  HStack,
  Stack,
  Progress,
} from "@chakra-ui/react";

import factory from "../smart-contract/factory";
import web3 from "../smart-contract/web3";
import Campaign from "../smart-contract/campaign";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FaHandshake } from "react-icons/fa";
import { FcShare, FcDonate, FcMoneyTransfer } from "react-icons/fc";
import { connectToDatabase } from "../lib/mongodb";
import { connectMongo } from "../utils/connectMongo";

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();
  await connectMongo();
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  // ! FETCHING FROM DATABASE...
  const dbCampaigns = await db.collection("campaigns").find().toArray();
  const dbUsers = await db.collection("users").find().toArray();

  return {
    props: {
      campaigns,
      users: JSON.parse(JSON.stringify(dbUsers)),
      dbCamp: JSON.parse(JSON.stringify(dbCampaigns)),
    },
  };
}

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={useColorModeValue("gray.100", "gray.700")}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
    </Stack>
  );
};

function CampaignCardNew({ name, description, creatorId, imageURL, id, balance, target, ethPrice, users, dbCamp }) {
  var emmmmmmm = "";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  async function findEmail() {
    for (var i = 0; i < dbCamp.length; i++) {
      if (dbCamp[i].name == name) {
        // console.log("IN IF");3333333333333
        setEmail(dbCamp[i].creatorEmail);
        // console.log("EMAIL:");
        // console.log(email);
        return dbCamp[i].creatorEmail;
      }
    }
    return;
  }
  async function findUsername(tempEmail) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].email == tempEmail) {
        const tempUsername = users[i].username;
        setUsername(tempUsername);
        return tempUsername;
        break;
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const tempEmail = await findEmail();
      setEmail(tempEmail);
      const tempUsername = await findUsername(tempEmail);
      setUsername(tempUsername);
    };
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NextLink href={`/campaign/${id}`}>
      <Box
        h={"30vh"}
        w={"65vw"}
        display={"flex"}
        flexDirection={"row"}
        position="relative"
        cursor="pointer"
        bgColor={"#ffffff"}
        borderRadius={"20"}
        transition={"transform 0.3s ease"}
        boxShadow="sm"
        _hover={{
          transform: "translateX(8px)",
        }}
      >
        <Box h={"100%"} w={"25%"} borderRadius={"20"} borderRightRadius={"0"}>
          <Img
            src={imageURL}
            alt={`Picture of ${name}`}
            objectFit="cover"
            w="full"
            h="full"
            display="block"
            borderRadius={"20"}
            borderRightRadius={"0"}
          />
        </Box>
        <Box
          h={"100%"}
          w={"75%"}
          borderRadius={"20"}
          borderLeftRadius={"0"}
          padding={"1rem"}
          px={"2rem"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          pb={"1.5rem"}
        >
          <Box>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
              <Box display={"flex"} flexDirection={"row"}>
                <Box fontWeight={"600"} fontSize={"14px"} marginRight={"10px"}>
                  c/CommunityName
                </Box>{" "}
                <Box color={"gray.600"} fontSize={"14px"}>
                  7 hours ago by {username} ✅
                </Box>
              </Box>
              <Box display={"flex"} flexDirection={"row"}>
                <Text fontWeight={"bold"} paddingRight={"5px"}>
                  19
                </Text>
                <Text>days left</Text>
              </Box>
            </Box>

            <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight">
              {name}
            </Box>
            <Box maxW={"60%"}>
              <Text noOfLines={3}>{description}</Text>
            </Box>
          </Box>
          <Box>
            <Flex direction={"row"} justifyContent={"space-between"}>
              <Box maxW={{ base: "	15rem", sm: "sm" }}>
                <Text as="span">{balance > 0 ? "Raised : " + web3.utils.fromWei(balance, "ether") : "Raised : 0"}</Text>
                <Text as="span" pr={2}>
                  {" "}
                  ETH
                </Text>
                <Text
                  as="span"
                  fontSize="lg"
                  display={balance > 0 ? "inline" : "none"}
                  fontWeight={"normal"}
                  color={useColorModeValue("gray.500", "gray.200")}
                >
                  (${getWEIPriceInUSD(ethPrice, balance)})
                </Text>
              </Box>
              <Text fontSize={"md"} fontWeight="normal">
                Target : {web3.utils.fromWei(target, "ether")} ETH ($
                {getWEIPriceInUSD(ethPrice, target)})
              </Text>
            </Flex>
            <Progress colorScheme="blue" size="sm" value={balance} max={target} mt="2" />
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
}

export default function Home({ campaigns, users, dbCamp }) {
  const [campaignList, setCampaignList] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);
  const [campaignListNumber, setCampaignListNumber] = useState(0);

  async function getSummary() {
    try {
      const summary = await Promise.all(
        campaigns.map((campaign, i) => Campaign(campaigns[i]).methods.getSummary().call())
      );
      const ETHPrice = await getETHPrice();
      updateEthPrice(ETHPrice);
      setCampaignList(summary);
      setCampaignListNumber(3);
      return summary;
    } catch (e) {
      console.log(e);
    }
  }

  function handleShowMore() {
    setCampaignListNumber(campaignListNumber >= campaignList.length ? campaignListNumber : campaignListNumber + 1);
  }

  function getUser() {
    try {
      // const u = localStorage.getItem("email");
      // const o = JSON.parse(localStorage.getItem("user"));
      // //console.log(o);
      // setObj(o);
      // for (var i = 0; i < users.length; i++) {
      //   if (users[i].email == u) {
      //     console.log(users[i]);
      //     setUser(users[i]);
      //     break;
      //   }
      //   //console.log(JSON.stringify(user));
      // }
      // console.log("IN getUser");
      // console.log(users);
      // console.log(dbCamp);
    } catch (e) {
      console.log("Error in getUser().");
      console.log(e);
    }
  }

  useEffect(() => {
    getUser();
    getSummary();
  }, []);

  return (
    <div>
      <Head>
        <title>CryptAid</title>
        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} align={"left"} position={"relative"}>
          {" "}
          <Heading
            textAlign={useBreakpointValue({ base: "left" })}
            color={useColorModeValue("gray.800", "white")}
            as="h1"
            py={4}
          >
            Connecting projects that matter <br /> with people who care ✨
          </Heading>
          <Heading
            textAlign={useBreakpointValue({ base: "left" })}
            // fontFamily={"heading"}
            fontSize={"24px"}
            fontWeight={"200"}
            color={useColorModeValue("gray.800", "white")}
            as="h2"
            pb={14}
          >
            Bring a creative project to life 🥂
          </Heading>
          <NextLink href="/campaign/new">
            <Button
              display={{ sm: "inline-flex" }}
              w={"200px"}
              fontSize={"md"}
              fontWeight={600}
              color={"white"}
              borderRadius={"20"}
              bg={"#43B0F1"}
              _hover={{
                bg: "#0065A1",
                color: "#ffffff",
              }}
            >
              Create Campaign
            </Button>
          </NextLink>
          <Img position={"absolute"} right={40} top={53} src={"/landing1.png"} roundedTop="lg" objectFit="cover" />
        </Container>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
          <HStack spacing={2} justifyContent={"space-between"}>
            <Heading as="h2" size="lg">
              New Campaigns
            </Heading>
            <Button
              fontSize={"md"}
              fontWeight={200}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={"black"}
              pt={"20px"}
            >
              <NextLink href="/explore">View all ➡️</NextLink>
            </Button>
          </HStack>

          <Divider marginTop="4" />
          {campaignList.length > 0 ? (
            <SimpleGrid row={{ base: 1, md: 3 }} spacing={10} py={8}>
              {campaignList
                .slice(campaignList.length - campaignListNumber)
                .reverse()
                .map((el, i) => {
                  return (
                    <div key={i}>
                      <CampaignCardNew
                        name={el[5]}
                        description={el[6]}
                        creatorId={el[4]}
                        imageURL={el[7]}
                        id={campaigns[campaignList.length - 1 - i]}
                        target={el[8]}
                        balance={el[1]}
                        ethPrice={ethPrice}
                        users={users}
                        dbCamp={dbCamp}
                      />
                    </div>
                  );
                })}
            </SimpleGrid>
          ) : (
            <SimpleGrid row={{ base: 1, md: 3 }} spacing={10} py={8}>
              <Skeleton height="15rem" />
              <Skeleton height="15rem" />
              <Skeleton height="15rem" />
            </SimpleGrid>
          )}
          {campaignList.length > 3 && campaignListNumber != campaignList.length ? (
            <Button
              display={{ sm: "inline-flex" }}
              w={"200px"}
              fontSize={"md"}
              fontWeight={600}
              color={"black"}
              borderRadius={"20"}
              bg={"#ffffff"}
              border={"1px solid #0065A1"}
              marginLeft={"50%"}
              transform={"translate(-50%, 0)"}
              onClick={handleShowMore}
              _hover={{
                bg: "#0065A1",
                color: "#ffffff",
              }}
            >
              View more
            </Button>
          ) : (
            <></>
          )}
        </Container>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} id="howitworks">
          <HStack spacing={2}>
            <Heading as="h2" size="lg">
              How CryptAid Works
            </Heading>
          </HStack>
          <Divider marginTop="4" />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
            <Feature
              icon={<Icon as={FcDonate} w={10} h={10} />}
              title={"CREATE"}
              text={
                "Start raising funds for that cause, today. Easily create a new fundraising campaign in just 2 minutes."
              }
            />
            <Feature
              icon={<Icon as={FcShare} w={10} h={10} />}
              title={"SHARE"}
              text={"We let you share your favorite campaigns with your near and dear ones."}
            />
            <Feature
              icon={<Icon as={FcMoneyTransfer} w={10} h={10} />}
              title={"REQUEST"}
              text={
                "The campaign creator can withdraw specific funds, once his request is approved by 50% of the contributors."
              }
            />
          </SimpleGrid>
          <Divider marginTop="4" />
        </Container>
        <Container
          w={"100%"}
          h={"250px"}
          bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
          borderRadius={"30"}
          my={"80px"}
          py={"20px"}
          position={"relative"}
        >
          <Text color={"white"} fontSize={"2rem"} mx={"20px"} fontWeight={"600"} pb={"10px"}>
            Feeling Inspired ?
          </Text>
          <Text color={"white"} fontSize={"1rem"} mx={"20px"}>
            Let`s make a difference together. You can raise money or <br /> make a donation, and our platform will let
            you do that <br /> effortlessly anywhere in the world.
          </Text>
          <NextLink href="/campaign/new">
            <Button
              display={{ sm: "inline-flex" }}
              position={"absolute"}
              right={"10"}
              bottom={"10"}
              w={"200px"}
              fontSize={"md"}
              fontWeight={600}
              color={"black"}
              borderRadius={"20"}
              bg={"#97C5E0"}
              _hover={{
                bg: "#1CB5E0",
                color: "#ffffff",
              }}
            >
              Create Campaign
            </Button>
          </NextLink>
        </Container>
      </main>
    </div>
  );
}
