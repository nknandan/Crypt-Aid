import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import NoSSR from 'react-no-ssr';
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
import PDFFile from "./pdfFile";

export default function Home({ campaigns }) {
  return (
    <div>
      <Head>
        <title>About Us | CryptAid</title>
        <meta
          name="description"
          content="Transparent Crowdfunding in Blockchain"
        />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} height={"100vh"}>
          <Heading as="h2" size="lg" marginBottom={"5vh"}>
            About CryptAid
          </Heading>
          <NoSSR>
            <PDFDownloadLink document={<PDFFile />} fileName='Donation'>
              {({ loading }) => (loading ? <button>Loading document...</button> : <button>Download</button>)}
            </PDFDownloadLink>
          </NoSSR>
          {/* <PDFFile />    */}
        </Container>
      </main>
    </div>
  );
}
