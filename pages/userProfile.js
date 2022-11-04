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
import { connectMongo } from "../utils/connectMongo";
import User from "../models/user";

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  await connectMongo();
  const users = await User.find();
  console.log(users[0]);
  //console.log(campaigns);

  return {
    props: { campaigns },
  };
}

function CampaignCardNew({
  name,
  description,
  creatorId,
  imageURL,
  id,
  balance,
  target,
  ethPrice,
}) {
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
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
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

            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
            >
              {name}
            </Box>
            <Box maxW={"60%"}>
              <Text noOfLines={3}>{description}</Text>
            </Box>
          </Box>
          <Box>
            <Flex direction={"row"} justifyContent={"space-between"}>
              <Box maxW={{ base: "	15rem", sm: "sm" }}>
                <Text as="span">
                  {balance > 0
                    ? "Raised : " + web3.utils.fromWei(balance, "ether")
                    : "Raised : 0"}
                </Text>
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

export default function userProfile({ campaigns }) {
  const [campaignList, setCampaignList] = useState([]);
  const [newButton, setNewButton] = useState(1);
  async function getSummary() {
    try {
      const summary = await Promise.all(
        campaigns.map((campaign, i) =>
          Campaign(campaigns[i]).methods.getSummary().call()
        )
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
        <title>User Profile | CryptAid</title>
        <meta
          name="description"
          content="Transparent Crowdfunding in Blockchain"
        />
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
          <Flex
            height={"100vh"}
            width={"55vw"}
            bgColor={"gray.100"}
            flexDirection={"column"}
          >
            <Flex
              w={"90%"}
              h={"20%"}
              bgColor={"white"}
              borderBottomRadius={20}
              alignSelf={"center"}
              bgGradient={"linear(to-l, #2C2C7B, #1CB5E0)"}
            ></Flex>
            <Center
              borderRadius={"50%"}
              borderWidth={5}
              borderColor={"white"}
              h={"20vh"}
              w={"20vh"}
              pos={"absolute"}
              top={"14%"}
              left={"25vw"}
            >
              <Img
                src={"/asdas.jpg"}
                h={"19vh"}
                w={"19vh"}
                objectFit={"fill"}
                borderRadius={"50%"}
              ></Img>
            </Center>
            <Flex
              flexDir={"column"}
              w={"20vw"}
              pos={"absolute"}
              top={"20%"}
              left={"35vw"}
            >
              <Text fontSize={30} fontWeight={800} color={"blue.800"}>
                Alvin Antony
              </Text>
              <Text fontSize={15} fontWeight={300} mt={-2}>
                @alvinantonyshaju
              </Text>
            </Flex>
            <Button
              w={"7vh"}
              h={"7vh"}
              bgColor={"gray.300"}
              pos={"absolute"}
              left={"65vw"}
              top={"21%"}
              borderRadius={"50%"}
            >
              <Img objectFit={"contain"} src={"/settings.png"} />
            </Button>
            <Flex
              w={"100%"}
              mt={"12%"}
              px={"10%"}
              py={5}
              flexDirection={"column"}
            >
              <Heading mb={6}>Dashboard</Heading>
              <Flex
                flexDirection={"row"}
                width={"100%"}
                justifyContent={"space-evenly"}
              >
                <Center bgColor={"gray.200"} borderRadius={10} p={5} py={2}>
                  <Img src={"/totalamount.png"} height={10} mr={5} />
                  <Flex flexDir={"column"}>
                    <Text fontSize={16}>Total amount contributed</Text>
                    <Text fontSize={26} fontWeight={600} color={"blue.500"}>
                      $ 69.99
                    </Text>
                  </Flex>
                </Center>
                <Center bgColor={"gray.200"} borderRadius={10} p={5} py={2}>
                  <Img src={"/totalcampaigns.png"} height={10} mr={5} />
                  <Flex flexDir={"column"}>
                    <Text fontSize={16}>Total campaigns funded</Text>
                    <Text fontSize={26} fontWeight={600} color={"blue.500"}>
                      7
                    </Text>
                  </Flex>
                </Center>
              </Flex>
            </Flex>
            <Flex w={"100%"} px={"10%"} py={5} flexDirection={"column"}>
              <Heading>Active campaigns</Heading>
              <Divider marginTop="4" />
              <SimpleGrid spacing={10} py={8}>
                {campaignList
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
                  })}
              </SimpleGrid>
            </Flex>
          </Flex>
          <Flex
            height={"100vh"}
            width={"25vw"}
            bgColor={"gray.100"}
            borderLeftWidth={1}
            borderLeftColor={"gray.500"}
            flexDir={"column"}
            padding={10}
          >
            <Center
              bgColor={"gray.200"}
              borderRadius={10}
              p={5}
              py={2}
              justifyContent={"space-evenly"}
            >
              <Img src={"/user.png"} height={10} mr={5} />
              <Flex flexDir={"column"}>
                <Text fontSize={22} fontWeight={600} noOfLines={1}>
                  Alvin Antony Shaju
                </Text>
                <Center justifyContent={"flex-start"}>
                  <Flex
                    h={2}
                    w={2}
                    borderRadius={"50%"}
                    bgColor={"green.300"}
                    mr={3}
                  ></Flex>
                  <Text fontSize={16} color={"gray.500"}>
                    Online
                  </Text>
                </Center>
              </Flex>
            </Center>
            <Flex
              flexDir={"column"}
              mt={5}
              mb={5}
              maxH={"65vh"}
              overflowY={"auto"}
            >
              <Text fontSize={24} fontWeight={600} mb={5} mt={2}>
                Latest Activity
              </Text>
              <Center
                bgColor={"gray.200"}
                borderRadius={20}
                justifyContent={"flex-start"}
                mb={5}
                p={3}
                h={40}
              >
                <Img
                  src={"/dummy.png"}
                  height={"95%"}
                  borderRadius={20}
                  mr={5}
                />
                <Flex
                  flexDir={"column"}
                  justifyContent={"flex-start"}
                  h={"100%"}
                >
                  <Text fontWeight={"600"} fontSize={20}>
                    Hi alvin
                  </Text>
                  <Text fontWeight={"200"} fontSize={16} lineHeight={1} mb={3}>
                    Eda bring campaigns details and show here okay?
                  </Text>
                  <NextLink href="/">
                    <a>
                      <Text as="u" color={"blue.500"}>
                        Read more
                      </Text>
                    </a>
                  </NextLink>
                </Flex>
              </Center>
              <Center
                bgColor={"gray.200"}
                borderRadius={20}
                justifyContent={"flex-start"}
                mb={5}
                p={3}
                h={40}
              >
                <Img
                  src={"/dummy.png"}
                  height={"95%"}
                  borderRadius={20}
                  mr={5}
                />
                <Flex
                  flexDir={"column"}
                  justifyContent={"flex-start"}
                  h={"100%"}
                >
                  <Text fontWeight={"600"} fontSize={20}>
                    Hi alvin
                  </Text>
                  <Text fontWeight={"200"} fontSize={16} lineHeight={1} mb={3}>
                    Eda bring campaigns details and show here okay?
                  </Text>
                  <NextLink href="/">
                    <a>
                      <Text as="u" color={"blue.500"}>
                        Read more
                      </Text>
                    </a>
                  </NextLink>
                </Flex>
              </Center>
              <Center
                bgColor={"gray.200"}
                borderRadius={20}
                justifyContent={"flex-start"}
                mb={5}
                p={3}
                h={40}
              >
                <Img
                  src={"/dummy.png"}
                  height={"95%"}
                  borderRadius={20}
                  mr={5}
                />
                <Flex
                  flexDir={"column"}
                  justifyContent={"flex-start"}
                  h={"100%"}
                >
                  <Text fontWeight={"600"} fontSize={20}>
                    Hi alvin
                  </Text>
                  <Text fontWeight={"200"} fontSize={16} lineHeight={1} mb={3}>
                    Eda bring campaigns details and show here okay?
                  </Text>
                  <NextLink href="/">
                    <a>
                      <Text as="u" color={"blue.500"}>
                        Read more
                      </Text>
                    </a>
                  </NextLink>
                </Flex>
              </Center>
            </Flex>
          </Flex>
        </Container>
      </main>
    </div>
  );
}
