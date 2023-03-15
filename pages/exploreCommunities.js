/* eslint-disable react-hooks/rules-of-hooks */
import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { Grid, GridItem, textDecoration } from "@chakra-ui/react";
import { ChevronDownIcon, SunIcon } from "@chakra-ui/icons";
import { AiFillRocket, AiFillFire } from "react-icons/ai";
import { IoIosPodium } from "react-icons/io";
import { getETHPrice, getWEIPriceInUSD } from "../lib/getETHPrice";
import {
  Heading,
  useBreakpointValue,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
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
import User from "../models/user";

var cName2Id = {};

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();
  await connectMongo();
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  // ! FETCHING FROM DATABASE...
  const dbCampaigns = await db.collection("campaigns").find().toArray();
  const dbCommunities = await db.collection("communities").find().toArray();
  const dbUsers = await User.find();

  return {
    props: {
      campaigns,
      dbUsers: JSON.parse(JSON.stringify(dbUsers)),
      dbCamp: JSON.parse(JSON.stringify(dbCampaigns)),
      dbComm: JSON.parse(JSON.stringify(dbCommunities)),
    },
  };
}

function CommunityCard({ name, description, imageURL, creator, moderators, commCamps }) {
  console.log(imageURL);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(1);

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NextLink href={`/community/${encodeURIComponent(name)}`}>
      <Box
        h={"250px"}
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
        <Box bgColor={"white"} padding={"10px"} paddingLeft={"20px"} paddingRight={"20px"}>
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
            17 posts
          </Text>
          <Text fontWeight={600} color={"#2C2C7B"}>
            {moderators.length} members
          </Text>
          {joined ? (
            <Button
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

export default function exploreCommunities({ campaigns, dbUsers, dbCamp, dbComm }) {
  const [campaignList, setCampaignList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);
  const [newButton, setNewButton] = useState(1);
  const [popularButton, setPopularButton] = useState(0);
  const [trendingButton, setTrendingButton] = useState(0);

  async function getSummary() {
    try {
      const summary = await Promise.all(
        campaigns.map((campaign, i) => Campaign(campaigns[i]).methods.getSummary().call())
      );
      const ETHPrice = await getETHPrice();
      updateEthPrice(ETHPrice);
      setCampaignList(summary);
      setCommunityList(dbComm);
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

  useEffect(() => {
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Head>
        <title>Explore Communities | CryptAid</title>

        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
          <HStack spacing={2} justifyContent={"space-between"}>
            <Heading as="h2" size="lg">
              Explore all Communities
            </Heading>
          </HStack>

          <Divider marginTop="4" />
          {communityList.length > 0 ? (
            <SimpleGrid row={{ base: 1, md: 3 }} columns={1} minChildWidth="380px" spacing={10} py={8}>
              {communityList.slice(0).map((el, i) => {
                return (
                  <CommunityCard
                    name={el.name}
                    description={el.description}
                    imageURL={el.imageUrl}
                    creator={el.creator}
                    moderators={el.moderators}
                    commCamps={el.campaigns}
                    key={i}
                  />
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
        </Container>
      </main>
    </div>
  );
}
