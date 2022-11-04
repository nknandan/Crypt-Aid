import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { Center, Grid, GridItem, textDecoration } from "@chakra-ui/react";
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
          mt={-5}
          alignItems={"flex-start"}
          display={"flex"}
          flexDirection={"row"}
        >
          <Flex height={"100vh"} width={"20vw"} bgColor={"gray.200"}></Flex>
          <Flex height={"100vh"} width={"55vw"} bgColor={"gray.100"} flexDirection={"column"}>
            <Flex w={"90%"} h={"20%"} bgColor={"white"} borderBottomRadius={20}
              alignSelf={"center"}
              bgGradient={"linear(to-l, #2C2C7B, #1CB5E0)"}></Flex>
            <Center borderRadius={"50%"} borderWidth={5} borderColor={"white"} h={"20vh"} w={"20vh"} pos={"absolute"} top={"14%"} left={"25vw"}>
              <Img
                src={"/asdas.jpg"}
                h={"19vh"}
                w={"19vh"}
                objectFit={"fill"}
                borderRadius={"50%"}
              ></Img>
            </Center>
            <Flex flexDir={"column"} w={"20vw"} pos={"absolute"} top={"20%"} left={"35vw"}>
              <Text fontSize={30} fontWeight={800} color={"blue.800"}>Alvin Antony</Text>
              <Text fontSize={15} fontWeight={300} mt={-2}>@alvinantonyshaju</Text>
            </Flex>
            <Button w={"7vh"} h={"7vh"} bgColor={"gray.300"} pos={"absolute"} left={"65vw"} top={"21%"} borderRadius={"50%"}>
              <Img
              objectFit={"contain"}
                src={"/settings.png"}
              />
            </Button>
            <Flex bgColor={"red"} w={"100%"} h={"20%"} mt={"12%"}></Flex>
          </Flex>
          <Flex height={"100vh"} width={"25vw"} bgColor={"gray.100"} borderLeftWidth={1} borderLeftColor={"gray.500"}></Flex>
        </Container>
      </main>
    </div>
  );
}
