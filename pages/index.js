/* eslint-disable react-hooks/rules-of-hooks */
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

var cName2Id = {};
var userEmail = "";
var tempMod = [];
var tempMem = [];
var tempUser = {};

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();
  await connectMongo();
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  // ! FETCHING FROM DATABASE...
  const dbCampaigns = await db.collection("campaigns").find().toArray();
  const dbCommunities = await db.collection("communities").find().toArray();
  const dbUsers = await db.collection("users").find().toArray();

  return {
    props: {
      campaigns,
      users: JSON.parse(JSON.stringify(dbUsers)),
      dbCamp: JSON.parse(JSON.stringify(dbCampaigns)),
      dbComm: JSON.parse(JSON.stringify(dbCommunities)),
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
        setEmail(dbCamp[i].creatorEmail);
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
        bgColor={useColorModeValue("white", "#303030")}
        borderRadius={"20"}
        transition={"transform 0.3s ease"}
        boxShadow="sm"
        _hover={{
          transform: "translateY(-8px)",
        }}
        overflowY={"auto"}
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
                {/* <Box
                  fontWeight={"600"}
                  fontSize={"14px"}
                  marginRight={"10px"}
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  c/CommunityName
                </Box>{" "} */}
                <Box color={useColorModeValue("gray.600", "gray.400")} fontSize={"14px"}>
                  7 hours ago by {username} ✅
                </Box>
              </Box>
              <Box display={"flex"} flexDirection={"row"} color={useColorModeValue("gray.600", "gray.400")}>
                <Text fontWeight={"bold"} paddingRight={"5px"}>
                  19
                </Text>
                <Text>days left</Text>
              </Box>
            </Box>

            <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight">
              {name}
            </Box>
            <Box maxW={"60%"} color={useColorModeValue("gray.600", "gray.200")}>
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

function CommunityCardNew({ name, description, creatorId, imageURL, id, balance, target, ethPrice, users, dbCamp }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  async function findEmail() {
    for (var i = 0; i < dbCamp.length; i++) {
      if (dbCamp[i].name == name) {
        setEmail(dbCamp[i].creatorEmail);
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
        h={"20vh"}
        w={"20vw"}
        display={"flex"}
        flexDirection={"row"}
        position="relative"
        cursor="pointer"
        bgColor={useColorModeValue("white", "#303030")}
        borderRadius={"20"}
        transition={"transform 0.3s ease"}
        boxShadow="sm"
        _hover={{
          transform: "translateY(-8px)",
        }}
        mr={10}
      >
        <Box h={"100%"} w={"100%"} borderRadius={"20"}>
          <Img
            src={imageURL}
            alt={`Picture of ${name}`}
            objectFit="cover"
            w="full"
            h="full"
            display="block"
            borderRadius={"20"}
            position={"absolute"}
            opacity={"15%"}
            zIndex={0}
          />
          <Flex
            w={"100%"}
            h={"100%"}
            padding={"20px"}
            zIndex={9}
            opacity={"100%"}
            flexDir="column"
            justifyContent={"space-around"}
          >
            <Text fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight" color={"blue.900"} opacity={"100%"}>
              {name}
            </Text>
            <Box maxW={"60%"} color={useColorModeValue("gray.600", "gray.200")}>
              <Text noOfLines={3}>{description}</Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </NextLink>
  );
}

function CommunityCard({ name, description, imageURL, creator, moderators, members, commCamps, commPosts, dbUsers }) {
  console.log(imageURL);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(1);
  const [memberNo, setMemberNo] = useState();
  const [modNo, setModNo] = useState();
  const [postCount, setPostCount] = useState();

  useEffect(() => {
    console.log("HERRREE");
    console.log(name, description, imageURL, creator, moderators, members, commCamps, commPosts, dbUsers);
    if (members == undefined) setMemberNo(0);
    else setMemberNo(members.length);
    setModNo(moderators.length);
    const fetchData = async () => {};
    fetchData();
    userEmail = localStorage.getItem("email");
    var tempName = name;
    setPostCount(commPosts.length);
    // console.log(users);
    for (let i = 0; i < dbUsers.length; i++) {
      if (dbUsers[i].email == userEmail) {
        tempUser = dbUsers[i];
      }
    }
    tempMod = moderators || [];
    tempMem = members || [];
    if (tempMem.includes(userEmail) || tempMod.includes(userEmail)) setJoined(1);
    else setJoined(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NextLink href={`/community/${encodeURIComponent(name)}`}>
      <Box
        minH={"250px"}
        w={"400px"}
        position="relative"
        cursor="pointer"
        bgColor={"#ffffff"}
        borderRadius={"20"}
        transition={"transform 0.3s ease"}
        boxShadow="sm"
        _hover={{
          transform: "translateY(-8px)",
        }}
        overflow={"hidden"}
        zIndex={95}
        display={"flex"}
        flexDir={"column"}
        justifyContent={"space-between"}
        paddingBottom={"5%"}
        mr={"40px"}
      >
        <Box h={"100px"} w={"100%"} bgColor={"black"} overflow={"hidden"} position="relative">
          <Box h={"100px"} w={"100%"} position="relative">
            <Img
              src={imageURL}
              alt={`Picture of ${name}`}
              objectFit="cover"
              w="full"
              h="full"
              display="block"
              opacity={"0.5"}
              position={"absolute"}
            />
          </Box>
        </Box>
        <Text
          maxW={"260px"}
          noOfLines={1}
          color={"white"}
          fontSize={"24px"}
          opacity={"1"}
          zIndex={99}
          position="absolute"
          top={"65px"}
          left={"20px"}
          fontWeight={800}
        >
          {name}
        </Text>
        <Box bgColor={"white"} paddingLeft={"20px"} paddingRight={"20px"} minH={"30%"}>
          <Text noOfLines={3}>{description}</Text>
        </Box>
        <Flex
          flexDir={"row"}
          paddingLeft={"20px"}
          paddingRight={"20px"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontWeight={600} color={"#2C2C7B"}>
            {postCount} posts
          </Text>
          <Text fontWeight={600} color={"#2C2C7B"}>
            {memberNo + modNo} members
          </Text>
          {joined ? (
            <Button
              disabled={true}
              w={"25%"}
              borderRadius={50}
              bgColor={"#609966"}
              color={"white"}
              zIndex={99}
              _hover={{
                bgGradient: "linear(to-l, #609966, #9DC08B)",
                boxShadow: "xl",
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setJoined(!joined);
              }}
            >
              Joined
            </Button>
          ) : (
            <Button
              disabled={true}
              w={"25%"}
              borderRadius={50}
              bgColor={"#1CB5E0"}
              color={"white"}
              zIndex={99}
              _hover={{
                bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
                boxShadow: "xl",
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setJoined(!joined);
              }}
            >
              Join
            </Button>
          )}
        </Flex>
      </Box>
    </NextLink>
  );
}

export default function Home({ campaigns, users, dbCamp, dbComm }) {
  const [campaignList, setCampaignList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
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
      setCommunityList(dbComm);
      setCampaignListNumber(3);
      let i = 0;
      for (let ele of campaigns) {
        cName2Id[summary[i]["5"]] = ele;
        i++;
      }
      return summary;
    } catch (e) {
      console.log(e);
    }
  }

  function handleShowMore() {
    setCampaignListNumber(
      campaignListNumber >= campaignList.length
        ? campaignListNumber
        : campaignListNumber + 4 <= campaignList.length
        ? campaignListNumber + 4
        : campaignList.length
    );
    console.log("showing" + campaignListNumber);
    console.log("total" + campaignList.length);
  }

  useEffect(() => {
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Head>
        <title>CryptAid</title>
        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Flex p={"5rem"} className={styles.main} bgColor={useColorModeValue("gray.100", "#252525")}>
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
              color={useColorModeValue("white", "#252525")}
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
          {/* <Button onClick={()=>{console.log(await )}}>DEBUGG</Button> */}
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
              color={useColorModeValue("#252525", "gray.200")}
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
                  for (var j = 0; j < dbCamp.length; j++) {
                    if (dbCamp[j].name == el[5] && dbCamp[j].isApproved == true) {
                      return (
                        <div key={i}>
                          <CampaignCardNew
                            name={el[5]}
                            description={el[6]}
                            creatorId={el[4]}
                            imageURL={el[7]}
                            id={cName2Id[el[5]]}
                            target={el[8]}
                            balance={el[1]}
                            ethPrice={ethPrice}
                            users={users}
                            dbCamp={dbCamp}
                          />
                        </div>
                      );
                    }
                  }
                })}
            </SimpleGrid>
          ) : (
            <SimpleGrid row={{ base: 1, md: 3 }} spacing={10} py={8}>
              <Skeleton height="15rem" />
              <Skeleton height="15rem" />
              <Skeleton height="15rem" />
            </SimpleGrid>
          )}
          {campaignListNumber != campaignList.length && campaignList.length != 0 ? (
            <Button
              display={{ sm: "inline-flex" }}
              w={"200px"}
              fontSize={"md"}
              fontWeight={600}
              color={useColorModeValue("gray.900", "gray.100")}
              borderRadius={"20"}
              bg={useColorModeValue("white", "blue.400")}
              border={"1px solid"}
              borderColor={useColorModeValue("#0065A1", "#0065A1")}
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
        <Flex w={"70%"} justifyContent={"space-between"}>
          <Container
            h={"250px"}
            bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
            borderRadius={"30"}
            py={"20px"}
            mr={"20px"}
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
                w={"200px"}
                fontSize={"md"}
                fontWeight={600}
                color={"black"}
                mx={"20px"}
                ml={"220px"}
                mt={"20px"}
                borderRadius={"20"}
                bg={"#97C5E0"}
                _hover={{
                  bg: "#f2f2f2",
                  color: "#0070f3",
                }}
              >
                Create Campaign
              </Button>
            </NextLink>
          </Container>
          <Container h={"250px"} bgGradient="linear(to-l, #1CB5E0, #2C2C7B)" borderRadius={"30"} py={"20px"}>
            <Text color={"white"} fontSize={"2rem"} mx={"20px"} fontWeight={"600"} pb={"10px"}>
              Create A Community
            </Text>
            <Text color={"white"} fontSize={"1rem"} mx={"20px"}>
              Connect, Collaborate, and Share with like-minded people around the globe to help those in need. Foster
              growth and build your ideal community with ease
            </Text>
            <NextLink href="/community/newCommunity">
              <Button
                display={{ sm: "inline-flex" }}
                w={"200px"}
                fontSize={"md"}
                fontWeight={600}
                color={"black"}
                mx={"20px"}
                ml={"220px"}
                mt={"20px"}
                borderRadius={"20"}
                bg={"#97C5E0"}
                _hover={{
                  bg: "#f2f2f2",
                  color: "#0070f3",
                }}
              >
                Create Community
              </Button>
            </NextLink>
          </Container>
        </Flex>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} id="communities">
          <HStack spacing={2} justifyContent={"space-between"}>
            <Heading as="h2" size="lg">
              New Communities
            </Heading>
            <Button
              fontSize={"md"}
              fontWeight={200}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              color={useColorModeValue("#252525", "gray.200")}
              pt={"20px"}
            >
              <NextLink href="/exploreCommunities">View all ➡️</NextLink>
            </Button>
          </HStack>
          <Divider marginTop="4" />
          <Flex flexWrap={"nowrap"} overflowX={"auto"} py={"40px"}>
            {communityList
              .slice(communityList.length - 3 ? communityList.length - 2 : 0)
              .reverse()
              .map((el, i) => {
                return (
                  <div key={i}>
                    <CommunityCard
                      name={el.name}
                      description={el.description}
                      imageURL={el.imageUrl}
                      creator={el.creator}
                      moderators={el.moderators}
                      members={el.members}
                      commCamps={el.campaigns}
                      commPosts={el.posts}
                      key={i}
                      dbUsers={users}
                    />
                  </div>
                );
              })}
          </Flex>
        </Container>
      </Flex>
    </div>
  );
}
