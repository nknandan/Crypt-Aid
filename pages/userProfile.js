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
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
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

export default function userProfile({ campaigns }) {
  return (
    <div>
      <Head>
        <title>User Profile | CryptAid</title>
        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container
          maxHeight={"100vh"}
          maxWidth={"100vw"}
          padding={0}
          margin={0}
          alignItems={"flex-start"}
          display={"flex"}
          flexDirection={"row"}
        >
          <Flex height={"100vh"} width={"20vw"} bgColor={"red"}></Flex>
          <Flex height={"100vh"} width={"55vw"} bgColor={"blue"}></Flex>
          <Flex height={"100vh"} width={"25vw"} bgColor={"green"}></Flex>
        </Container>
      </main>
    </div>
  );
}
