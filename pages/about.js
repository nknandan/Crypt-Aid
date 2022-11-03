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
  return {
    props: { campaigns },
  };
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
