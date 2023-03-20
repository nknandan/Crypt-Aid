/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-children-prop */
import Head from "next/head";
import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import { useForm } from "react-hook-form";
import { Grid, GridItem, textDecoration } from "@chakra-ui/react";
import { IoIosPodium } from "react-icons/io";
import { useRouter } from "next/router";
import { useWindowSize } from "react-use";
import { getETHPrice, getETHPriceInUSD, getWEIPriceInUSD } from "../../lib/getETHPrice";
import {
  Box,
  Image,
  Flex,
  Stack,
  Divider,
  Textarea,
  Heading,
  Skeleton,
  Text,
  Container,
  Input,
  Img,
  Button,
  SimpleGrid,
  InputRightAddon,
  InputGroup,
  FormControl,
  FormLabel,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Icon,
  Tooltip,
  Alert,
  AlertIcon,
  AlertDescription,
  Progress,
  CloseButton,
  FormHelperText,
  Link,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { Line } from "@react-pdf/renderer";
import { ChevronDownIcon, SunIcon } from "@chakra-ui/icons";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { connectMongo } from "../../utils/connectMongo";
import { connectToDatabase } from "../../lib/mongodb";
import User from "../../models/user";
import NextLink from "next/link";

var tempComm = {};
var tempMod = [];
var tempMem = [];
var tempUser = {};
var userEmail = "";

export async function getServerSideProps({}) {
  var ETHPrice = 1756.48;
  const { db } = await connectToDatabase();
  await connectMongo();
  const dbCommunities = await db.collection("communities").find().toArray();
  const users = await User.find();
  // console.log(JSON.parse(JSON.stringify(users)));
  return {
    props: {
      dbComm: JSON.parse(JSON.stringify(dbCommunities)),
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}

function CommentInbox() {
  const [comments, setComments] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newComment = event.target.comment.value;
    setComments([...comments, newComment]);
    event.target.comment.value = "";
  };

  return (
    <Box w={"100%"} justifyContent={"space-between"}>
      <Flex flexDir={"row"} w={"100%"} justifyContent={"space-between"} mb={"2%"} mt={4}>
        <Box w={"80%"}>
          <form>
            <FormControl id="value">
              <InputGroup w={"100%"}>
                <Input
                  type="string"
                  borderColor={"gray.300"}
                  placeholder={"Enter your post here"}
                  onChange={(e) => {}}
                />
              </InputGroup>
            </FormControl>
          </form>
        </Box>
        <Button
          w={"15%"}
          bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
          color={"white"}
          _hover={{
            bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
            boxShadow: "xl",
          }}
          onClick={() => {}}
          borderRadius={20}
        >
          Post
        </Button>
      </Flex>
    </Box>
  );
}

function Feed({ posts, campPosts }) {
  const [isCampaign, setIsCampaign] = useState(0);
  return <Flex>{isCampaign ? <></> : <></>}</Flex>;
}

function CampaignCardNew({ name, description, creatorId, imageURL, id, balance, target, ethPrice, dbUsers, dbCamp }) {
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
    for (var i = 0; i < dbUsers.length; i++) {
      if (dbUsers[i].email == tempEmail) {
        const tempUsername = dbUsers[i].username;
        setUsername(tempUsername);
        return tempUsername;
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
    // eslint-disable-next-line react/jsx-no-undef
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
                <Box fontWeight={"600"} fontSize={"14px"} marginRight={"10px"}>
                  c/CommunityName
                </Box>{" "}
                <Box color={"gray.600"} fontSize={"14px"}>
                  6 hours ago by {username} ✅
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
              max={web3.utils.fromWei(target, "ether")}
              mt="2"
            />
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
}

export default function CommunitySingle({ dbComm, users }) {
  const router = useRouter();

  const [joined, setJoined] = useState(1);
  const [newButton, setNewButton] = useState(1);
  const [popularButton, setPopularButton] = useState(0);
  const [trendingButton, setTrendingButton] = useState(0);
  const [communityName, setCommunityName] = useState();
  const [memberNo, setMemberNo] = useState();
  const [modNo, setModNo] = useState();
  const [createPostMode, setCreatePostMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newCampTitle, setNewCampTitle] = useState("");
  const [newCampURL, setNewCampURL] = useState("");

  const [posts, setPosts] = useState([]);
  const [campPosts, setCampPosts] = useState([]);

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  useEffect(() => {
    userEmail = localStorage.getItem("email");
    var tempName = router.query.name;
    setCommunityName(tempName);
    // console.log(users);
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == userEmail) {
        tempUser = users[i];
      }
    }
    for (let i = 0; i < dbComm.length; i++) {
      if (dbComm[i].name == tempName) {
        tempComm = dbComm[i];
        tempMod = tempComm.moderators || [];
        tempMem = tempComm.members || [];
        if (tempMem.includes(userEmail) || tempMod.includes(userEmail)) setJoined(1);
        else setJoined(0);
        if (tempMem == undefined) setMemberNo(0);
        else setMemberNo(tempMem.length);
        setModNo(tempMod.length);
      }
    }
    console.log(tempUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function joinComm() {
    if (tempComm["members"] == undefined) tempComm["members"] = [userEmail];
    else tempComm.members.push(userEmail);
    // console.log(tempComm);
    setJoined(1);
    try {
      fetch("/api/communities/addMem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempComm }),
      });
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
    if (tempUser["joinedCommunities"] == undefined) tempUser["joinedCommunities"] = [tempComm.name];
    else tempUser["joinedCommunities"].push(tempComm.name);
    try {
      fetch("/api/communities/addMem", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempUser }),
      });
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  return (
    <div>
      <Head>
        <title>Community Details</title>
        <meta name="description" content="Create a Withdrawal Request" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main>
        {" "}
        <Flex px={"17.5vw"} direction={"column"} gap={"3vw"}>
          <Box w={"100%"} h={"250px"}>
            <Img w={"100%"} h={"100%"} src={tempComm.imageUrl} objectFit="cover" borderRadius={30} />
          </Box>
          <Flex w={"100%"} justifyContent={"space-between"} alignItems={"flex-start"}>
            <Flex w={"66%"} flexDir={"column"}>
              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                borderRadius={8}
                p={6}
                py={2}
                borderWidth={1}
                borderColor={"gray.300"}
                w={"100%"}
              >
                <Heading fontSize={"44px"}>{tempComm.name}</Heading>
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
                      joinComm();
                    }}
                  >
                    Join
                  </Button>
                )}
              </Flex>
              {createPostMode ? (
                <Box borderWidth={1} borderColor={"gray.300"} p={4} borderRadius={8} my={6}>
                  <Flex alignItems={"center"}>
                    <Button
                      p={0}
                      mr={2}
                      onClick={() => {
                        setCreatePostMode(false);
                      }}
                    >
                      <ArrowBackIcon h={"24px"} w={"24px"} />
                    </Button>
                    <Heading
                      lineHeight={1}
                      fontSize={{ base: "2xl", sm: "3xl" }}
                      color={useColorModeValue("#2C2C7B", "teal.200")}
                    >
                      Create a post
                    </Heading>
                  </Flex>
                  <Divider marginTop="2" />
                  <Tabs
                    mt={4}
                    onChange={handleTabChange}
                    index={selectedTab}
                    variant="enclosed-colored"
                    size="md"
                    align="center"
                    isFitted
                  >
                    <TabList>
                      <Tab>Post</Tab>
                      <Tab>Share Campaign</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <Flex>
                          <Box bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8} w={"100%"}>
                            <form>
                              <Stack spacing={4}>
                                <FormControl id="campaignName">
                                  <FormLabel>Title</FormLabel>
                                  <Input
                                    placeholder={"Covid Relief Fund"}
                                    value={newPostTitle}
                                    onChange={(e) => {
                                      setNewPostTitle(e.target.value);
                                    }}
                                  />
                                </FormControl>
                                <FormControl id="description">
                                  <FormLabel>Description</FormLabel>
                                  <Textarea
                                    placeholder={
                                      "The COVID-19 pandemic is one of the worst health and economic crises in modern history and it continues to require the best of humanity to overcome. Your donation to this fund will help stop the spread of the virus, including the highly contagious Omicron variant, to protect us all."
                                    }
                                    value={newPostDescription}
                                    onChange={(e) => {
                                      setNewPostDescription(e.target.value);
                                    }}
                                  />
                                </FormControl>
                                <Button
                                  w={"15%"}
                                  bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
                                  color={"white"}
                                  _hover={{
                                    bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
                                    boxShadow: "xl",
                                  }}
                                  onClick={() => {}}
                                  borderRadius={20}
                                  alignSelf={"flex-end"}
                                >
                                  Post
                                </Button>
                              </Stack>
                            </form>
                          </Box>
                        </Flex>
                      </TabPanel>
                      <TabPanel>
                        <Flex>
                          <Box bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8} w={"100%"}>
                            <form>
                              <Stack spacing={4}>
                                <FormControl id="campaignName">
                                  <FormLabel>Title</FormLabel>
                                  <Input
                                    placeholder={"Covid Relief Fund"}
                                    value={newCampTitle}
                                    onChange={(e) => {
                                      setNewCampTitle(e.target.value);
                                    }}
                                  />
                                </FormControl>
                                <FormControl id="description">
                                  <FormLabel>Campaign URL</FormLabel>
                                  <Input
                                    placeholder={
                                      "http://localhost:3002/campaign/0x880B2078e57CbBac229863c5E77DB658bA382176/"
                                    }
                                    value={newCampURL}
                                    onChange={(e) => {
                                      setNewCampURL(e.target.value);
                                    }}
                                  />
                                </FormControl>
                                <Button
                                  w={"15%"}
                                  bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
                                  color={"white"}
                                  _hover={{
                                    bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
                                    boxShadow: "xl",
                                  }}
                                  onClick={() => {}}
                                  borderRadius={20}
                                  alignSelf={"flex-end"}
                                >
                                  Post
                                </Button>
                              </Stack>
                            </form>
                          </Box>
                        </Flex>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                  {/* <Box w={"100%"} alignContent={"center"} justifyContent={"center"}>
                    <CommentInbox />
                  </Box> */}
                </Box>
              ) : (
                <></>
              )}

              <Flex w={"100%"} bgColor={"gray.200"} p={2} alignItems={"center"} mt={4} borderRadius={8}>
                <Button
                  colorScheme="blue"
                  variant="ghost"
                  isActive={newButton}
                  borderRadius={20}
                  mr={5}
                  onClick={() => {
                    setNewButton(1);
                    setTrendingButton(0);
                  }}
                  _hover={{ bg: "gray.300" }}
                >
                  <SunIcon />
                  <Text ml={2}>New</Text>
                </Button>

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
                  <Icon as={IoIosPodium} /> <Text ml={2}>Trending</Text>
                </Button>
              </Flex>

              <Flex h={"100vh"}>
                <Feed posts={posts} campPosts={campPosts} />
              </Flex>
            </Flex>
            <Box w={"30%"}>
              <Box borderWidth={1} borderColor={"gray.300"} borderRadius={8} p={5}>
                <Text color={"#2C2C7B"} fontWeight={600} fontSize={"22px"}>
                  About community
                </Text>
                <Text mt={2}>{tempComm.description}</Text>
                <Text color={"gray.600"} mt={2} fontWeight={200}>
                  Created Jan 25, 2012
                </Text>
                <Box w={"100%"} bgColor={"gray.300"} h={"1px"} mt={1}></Box>
                <Flex w={"100%"} justifyContent={"space-evenly"}>
                  <Flex alignItems={"center"} justifyContent={"center"} flexDirection={"column"} py={3}>
                    <Text fontWeight={600} fontSize={"22px"} color={"#2C2C7B"}>
                      {memberNo + modNo}
                    </Text>
                    <Text fontSize={"12px"} color={"gray.600"}>
                      Members
                    </Text>
                  </Flex>
                  <Flex alignItems={"center"} justifyContent={"center"} flexDirection={"column"} py={3}>
                    <Text fontWeight={600} fontSize={"22px"} color={"#2C2C7B"}>
                      17
                    </Text>
                    <Text fontSize={"12px"} color={"gray.600"}>
                      Posts
                    </Text>
                  </Flex>
                </Flex>
                <Box w={"100%"} bgColor={"gray.300"} h={"1px"} mt={1}></Box>
                <Box my={5}>
                  <Button
                    w={"100%"}
                    borderRadius={50}
                    bgColor={"#43B0F1"}
                    color={"white"}
                    zIndex={99}
                    _hover={{
                      bgGradient: "linear(to-l, #0065A1, #43B0F1)",
                      boxShadow: "xl",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCreatePostMode(true);
                    }}
                  >
                    Create Post
                  </Button>
                </Box>
                <Box w={"100%"} bgColor={"gray.300"} h={"1px"} mt={1}></Box>
                <Text mt={2} color={"gray.600"} fontWeight={500} fontSize={"18px"}>
                  Moderators
                </Text>
                <Flex px={4} alignItems={"flex-start"} flexDir={"column"}>
                  {tempMod.slice(0).map((el) => {
                    return (
                      <Flex px={4} alignItems={"center"} mt={2} key={el}>
                        <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                        <Text color={"black"}>{el}</Text>
                      </Flex>
                    );
                  })}
                </Flex>
              </Box>
              <Box borderWidth={1} borderColor={"gray.300"} borderRadius={8} p={5} mt={6}>
                <Text color={"#2C2C7B"} fontWeight={600} fontSize={"22px"}>
                  Note from the moderation team
                </Text>
                <Text mt={2}>
                  Bassiste, contrebassiste et compositeur, après avoir travaillé pour de nombreux artistes depuis plus
                  de 20 ans et enregistré près de 50 albums, je présente en 2023 mon 3 em Album
                </Text>
              </Box>
              <Box borderWidth={1} borderColor={"gray.300"} borderRadius={8} p={5} mt={6}>
                <Text color={"#2C2C7B"} fontWeight={600} fontSize={"22px"}>
                  Members
                </Text>
                {tempMem.slice(0).map((el) => {
                  return (
                    <Flex px={4} alignItems={"center"} mt={2} key={el}>
                      <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                      <Text color={"black"}>{el}</Text>
                    </Flex>
                  );
                })}
                {/* <Flex px={4} alignItems={"center"} mt={2}>
                  <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                  <Text color={"black"}>HarshaRocks</Text>
                </Flex>
                <Flex px={4} alignItems={"center"}>
                  <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                  <Text color={"black"}>HarshaRocks</Text>
                </Flex>
                <Flex px={4} alignItems={"center"}>
                  <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                  <Text color={"black"}>HarshaRocks</Text>
                </Flex>
                <Flex px={4} alignItems={"center"}>
                  <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                  <Text color={"black"}>HarshaRocks</Text>
                </Flex>
                <Flex px={4} alignItems={"center"}>
                  <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                  <Text color={"black"}>HarshaRocks</Text>
                </Flex>
                <Flex px={4} alignItems={"center"}>
                  <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                  <Text color={"black"}>HarshaRocks</Text>
                </Flex> */}
              </Box>
            </Box>
          </Flex>
        </Flex>
      </main>
    </div>
  );
}
