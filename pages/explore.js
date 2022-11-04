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

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  console.log(campaigns);

  return {
    props: { campaigns },
  };
}

function CampaignCardNew({ name, description, creatorId, imageURL, id, balance, target, ethPrice }) {
  return (
    <NextLink href={`/campaign/${id}`}>
      <Box
        h={"40vh"}
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
                  6 hours ago by {creatorId} ✅
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
            <Progress
              colorScheme="blue"
              size="sm"
              value={web3.utils.fromWei(balance, "ether")}
              // value={50}
              max={web3.utils.fromWei(target, "ether")}
              mt="2"
            />
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
}

export default function Home({ campaigns }) {
  const [campaignList, setCampaignList] = useState([]);
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
      return summary;
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getSummary();
  }, []);
  return (
    <div>
      <Head>
        <title>Explore Campaigns | CryptAid</title>

        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
          <HStack spacing={2} justifyContent={"space-between"}>
            <Heading as="h2" size="lg">
              Explore all Campaigns
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)">
              <GridItem width="20" h="5" bg="white.500">
                <Button
                  colorScheme="blue"
                  variant="ghost"
                  isActive={newButton}
                  borderRadius={20}
                  onClick={() => {
                    setNewButton(1);
                    setTrendingButton(0);
                  }}
                  _hover={{ bg: "gray.300" }}
                >
                  <SunIcon /> New
                </Button>
              </GridItem>
              <GridItem width="23" h="5" bg="white.500">
                <Button
                  colorScheme="blue"
                  variant="ghost"
                  isActive={trendingButton}
                  borderRadius={20}
                  onClick={() => {
                    setNewButton(0);
                    setTrendingButton(1);
                  }}
                  _hover={{ bg: "gray.300" }}
                >
                  <Icon as={IoIosPodium} /> Trending
                </Button>
              </GridItem>
              {/* <GridItem width="23" h="5" bg="white.500">
                <Button colorScheme="blue" variant="ghost" onClick={() => { setNewButton(0); setPopularButton(1); setTrendingButton(0) }}>
                  <Icon as={AiFillRocket} /> Popular
                </Button>
              </GridItem> */}
            </Grid>
          </HStack>

          <Divider marginTop="4" />
          {campaignList.length > 0 ? (
            <SimpleGrid row={{ base: 1, md: 3 }} spacing={10} py={8}>
              {newButton == 1
                ? campaignList
                    .slice(0)
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
                          />
                        </div>
                      );
                    })
                : trendingButton == 1
                ? campaignList
                    .sort((a, b) => {
                      return b[1] - a[1];
                    })
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
                          />
                        </div>
                      );
                    })
                : {}}
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
