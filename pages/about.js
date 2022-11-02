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
              // value={web3.utils.fromWei(balance, "ether")}
              value={web3.utils.fromWei(balance, "ether")}
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
      console.log("summary ", summary);
      setCampaignList(summary);
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
        <title>About Us | CryptAid</title>
        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} height={"100vh"}>
          <Heading as="h2" size="lg" marginBottom={"5vh"}>
            About CryptAid
          </Heading>
          <Stack spacing={"10vh"} justifyContent={"space-between"}>
            <Flex direction={"row"} justifyContent={"center"}>
              <Text maxW={"40vw"} fontSize={"18px"}>
                Every one of us has the desire for the world to be a better place. That first inspiration to help
                someone, improve a community, contribute to a noble cause or perhaps transform a whole country. Through
                CryptAid, we enable people and nonprofits to put compassion into practice. Since that is how change
                occurs.
              </Text>
              {/* <Image src={""}/> */}
            </Flex>
            <Flex direction={"row"} justifyContent={"center"}>
              <Text maxW={"40vw"} fontSize={"18px"}>
                With fundraising for everyone, we are building the giving layer of the internet—a place where people,
                groups, companies, and nonprofit organizations can support important causes and collect funds to have a
                long-lasting impact. Through CryptAid, individuals and organizations can raise the funds they need to
                mobilize support for their cause and reach a large audience. Are you prepared to join us as we improve
                the way people give and change lives?
              </Text>
              {/* <Image src={""}/> */}
            </Flex>
            <Flex direction={"row"} justifyContent={"center"}>
              <Text maxW={"40vw"} fontSize={"18px"}>
                Launched in 2022, We are the first entry into the world’s social fundraising platforms. We aim to have a
                transparent, anti-fraudulent, decentralized platform where people can contribute. In this way, we can
                create a sense of trust among individuals so that they can donate their money to worthy causes without
                being concerned about being scammed. With the help of blockchain technology, we provide our users with a
                secure, transparent and anti-fraud platform for fundraising.
              </Text>
              {/* <Image src={""}/> */}
            </Flex>
          </Stack>
        </Container>
      </main>
    </div>
  );
}
