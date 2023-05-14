import Head from "next/head";
import { useState, useEffect, useReducer } from "react";
import NextLink from "next/link";
import styles from "../../styles/Home.module.css";
import { Center, Grid, GridItem, textDecoration } from "@chakra-ui/react";
import { getETHPrice, getWEIPriceInUSD } from "../../lib/getETHPrice";
import NavbarAdmin from "../../components/NavbarAdmin";
import axios from "axios";
import {
  Heading,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Container,
  SimpleGrid,
  InputRightAddon,
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  Img,
  Progress,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import factory from "../../smart-contract/factory";
import web3 from "../../smart-contract/web3";
import Campaign from "../../smart-contract/campaign";
import { CheckIcon, SpinnerIcon } from "@chakra-ui/icons";
import { FaHandshake } from "react-icons/fa";
import { FcShare, FcDonate, FcMoneyTransfer } from "react-icons/fc";
import { connectMongo } from "../../utils/connectMongo";
import User from "../../models/user";
import CampaignModel from "../../models/campaignModel";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

var cName2Id = {};
var thisUser = {};

// CampaignList : consists of campaigns from blockchain
// CampaignList1 : consists of campaigns from database

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  await connectMongo();
  const users = await User.find();
  const dbCamp = await CampaignModel.find();
  return {
    props: {
      campaigns: campaigns,
      users: JSON.parse(JSON.stringify(users)),
      dbCamp: JSON.parse(JSON.stringify(dbCamp)),
    },
  };
}

export default function VerifyAccount({ campaigns, users, dbCamp }) {
  const [approvedPendingTerminated, setApprovedPendingTerminated] = useState(0);
  const [campaignsPage, setCampaignsPage] = useState(0);
  // No Settings Screen as of now.
  const [settingsScreen, setSettingsScreen] = useState(false);
  const [campaignList, setCampaignList] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);
  const [approvedNumber, setApprovedNumber] = useState();
  const [notApprovedNumber, setNotApprovedNumber] = useState();
  const [adminLogIn, setAdminLogIn] = useState(1);
  const [invalidAdminLogIn, setInvalidAdminLogIn] = useState(0);
  const [adminEnteredMail, setAdminEnteredMail] = useState("");
  const [adminEnteredPass, setAdminEnteredPass] = useState("");
  const adminmails = ["admin1", "admin2", "admin3", "admin4"];
  const adminpass = ["admin1pass", "admin2pass", "admin3pass", "admin4pass"];
  // Dummy to avoid log of errors in Console.
  const [obj, setObj] = useState({});
  const [user, setUser] = useState({});

  const router = useRouter();
  const {email} = router.query;

  async function getDbCampaigns() {
    let res = await fetch("/api/campaign/create", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let dbCamp = await res.json();
    // console.log(dbCamp);
  }

  async function getSummary() {
    try {
      const summary = await Promise.all(
        campaigns.map((campaign, i) => Campaign(campaigns[i]).methods.getSummary().call())
      );
      const ethPrice = await getETHPrice();
      updateEthPrice(ethPrice);
      setCampaignList(summary);
      let i = 0;
      for (let ele of campaigns) {
        cName2Id[summary[i]["5"]] = ele;
        i++;
      }
      // setCampaignListNumber(3);
      return summary;
    } catch (e) {
      console.log(e);
    }
  }

  function getUser() {
    try {
      const u = localStorage.getItem("email");
      const o = JSON.parse(localStorage.getItem("user"));
      setObj(o);
      for (var i = 0; i < users.length; i++) {
        if (users[i].email == u) {
          setUser(users[i]);
          break;
        }
      }
    } catch (e) {
      console.log("Error in getUser().");
      console.log(e);
    }
  }

  function getNumber() {
    var ab;
    const totalNumberTemp = dbCamp.length;
    var notApprovedNumberTemp = 0;
    for (var i = 0; i < dbCamp.length; i++) {
      if (dbCamp[i].isApproved == false) notApprovedNumberTemp += 1;
    }
    var approvedNumberTemp = totalNumberTemp - notApprovedNumberTemp;
    setApprovedNumber(approvedNumberTemp);
    setNotApprovedNumber(notApprovedNumberTemp);
  }

  function checkAdminCredentials() {
    if (adminmails.includes(adminEnteredMail) && adminpass.includes(adminEnteredPass)) {
      setAdminLogIn(0);
      setInvalidAdminLogIn(0);
      localStorage.setItem("adminAuth", "true");
    } else {
      setInvalidAdminLogIn(1);
    }
  }

  useEffect(() => {
    for(var i=0; i<users.length; i++){
      if(users[i].email == email)
        thisUser = users[i];
    }
    getDbCampaigns();
    getUser();
    getSummary();
    getNumber();
    if (localStorage.getItem("adminAuth") === "true") {
      setAdminLogIn(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verifyAcc(){
    thisUser["pendingVerification"] = false;
    thisUser["verificationComplete"] = true;
    try {
      fetch("/api/user4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thisUser }),
      });
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  return (
    <div>
      <Head>
        <title>Admin Profile | CryptAid</title>
        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Flex minH={"100vh"} align={"stretch"}>
          {adminLogIn ? (
            <Box
              height={"80%"}
              width={"35vw"}
              bg={"gray.100"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              border={"1px"}
              borderColor={"gray"}
              borderRadius={10}
            >
              <Flex height={"60vh"} width={"30vw"} flexDirection={"column"} align={"center"} mt={"15vh"}>
                <Heading fontSize={"50px"}>Welcome Admin !</Heading>
                <Text fontSize={"20px"} color={"gray.500"}>
                  Help the people, make big changes
                </Text>
                <form>
                  <FormControl id="value" mt={"5vh"} ml={"-25%"}>
                    <FormLabel>Email</FormLabel>
                    <InputGroup mt={-2} w={"150%"}>
                      <Input
                        type="string"
                        borderColor={"gray.300"}
                        placeholder={"johnnysilverhand@gmail.com"}
                        onChange={(e) => {
                          setAdminEnteredMail(e.currentTarget.value);
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl id="password" type="password" mt={"3vh"} ml={"-25%"}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup mt={-2} w={"150%"}>
                      <Input
                        type="password"
                        borderColor={"gray.300"}
                        placeholder={"xxxxxxxx"}
                        onChange={(e) => {
                          setAdminEnteredPass(e.currentTarget.value);
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                </form>
                <Button
                  w={"50%"}
                  bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
                  color={"white"}
                  _hover={{
                    bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
                    boxShadow: "xl",
                  }}
                  mt={"5vh"}
                  onClick={() => {
                    checkAdminCredentials();
                  }}
                >
                  Login
                </Button>
                {invalidAdminLogIn ? (
                  <Text color={"red"} mt={10}>
                    The credentials you entered is incorrect. Try again !
                  </Text>
                ) : (
                  <></>
                )}
              </Flex>
            </Box>
          ) : (
            <Flex
              maxW={"100vw"}
              minH={"100vh"}
              scrollBehavior={"auto"}
              bgColor={"white"}
              zIndex={"1000"}
              p={0}
              m={0}
              alignItems={"flex-start"}
              flexDirection={"row"}
              position={"absolute"}
              top={0}
              left={0}
              align={"stretch"}
            >
              <NavbarAdmin />
              <Flex
                align={"stretch"}
                minH={"130vh"}
                width={"25vw"}
                bgColor={"gray.100"}
                borderWidth={"2px"}
                borderRightColor={"gray.500"}
              ></Flex>
              <Flex align={"stretch"} minH={"130vh"} width={"55vw"} bgColor={"gray.100"} flexDirection={"column"}>
                <Flex
                  w={"90%"}
                  h={"20vh"}
                  borderBottomRadius={20}
                  alignSelf={"center"}
                  bgGradient={"linear(to-l, #2C2C7B, #1CB5E0)"}
                ></Flex>
                <Flex flexDir={"row"} justifyContent={"flex-start"} pl={"10%"} mt={"-8%"}>
                  <Center mr={"2%"} minW={"19%"}>
                    <Img
                      src={
                        "https://contentstatic.techgig.com/photo/76920096/career-as-system-administrator-skills-required-certifications-and-salaries.jpg?186038"
                      }
                      alt="Profile Picture"
                      h={"9vw"}
                      w={"9vw"}
                      objectFit={"cover"}
                      borderRadius={"50%"}
                    ></Img>
                  </Center>
                  <Flex w={"79%"} justifyContent={"space-between"} pr={"10%"} alignItems={"center"}>
                    <Flex flexDir={"column"}>
                      <Text fontSize={30} fontWeight={800} color={"blue.800"} mt={"30%"}>
                        Administrator
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex flexDirection={"column"}>
                  {/* <Button
                    color={"red"}
                    onClick={() => {
                      getDbCampaigns();
                    }}
                  >
                    DEBUG{" "}
                  </Button> */}
                  <Flex w={"100%"} mt={"2%"} px={"10%"} py={5} flexDirection={"column"}>
                    <Heading mb={6} fontSize={32}>
                      Verify User Account
                    </Heading>
                    <Heading fontSize={26} color={"blue.600"}>
                      <Text>Contact Information</Text>
                    </Heading>
                    <Flex w={"100%"} flexDir={"column"}>
                      <Flex flexDir={"column"} mt={10} w={"70%"}>
                        <Text fontSize={18} mb={2}>
                          Email address
                        </Text>
                        <Flex
                          borderWidth={1}
                          borderRadius={5}
                          borderColor={"blue.300"}
                          p={2}
                          pb={1}
                          px={5}
                          w={"100%"}
                          color={"gray.600"}
                          justifyContent={"space-between"}
                        >
                          {thisUser.email}
                          <Img height={7} src={"/mail.png"} />
                        </Flex>
                      </Flex>
                      <Flex w={"70%"} justifyContent={"space-between"}>
                        <Flex flexDir={"column"} mt={10} w={"45%"}>
                          <Text fontSize={18} mb={2}>
                            Username
                          </Text>
                          <Flex
                            borderWidth={1}
                            borderRadius={5}
                            borderColor={"blue.300"}
                            p={2}
                            pb={1}
                            px={5}
                            w={"100%"}
                            color={"gray.600"}
                            justifyContent={"space-between"}
                          >
                            {thisUser.username}
                          </Flex>
                        </Flex>
                        <Flex flexDir={"column"} mt={10} w={"45%"}>
                          <Text fontSize={18} mb={2}>
                            Contact Number
                          </Text>
                          <Flex
                            borderWidth={1}
                            borderRadius={5}
                            borderColor={"blue.300"}
                            p={2}
                            pb={1}
                            px={5}
                            w={"100%"}
                            color={"gray.600"}
                            justifyContent={"space-between"}
                          >
                            {thisUser.phoneNumber}
                          </Flex>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Heading fontSize={26} my={10} color={"blue.600"}>
                      <Text>Personal Documents</Text>
                    </Heading>
                    <Flex flexDirection={"row"} width={"100%"} justifyContent={"space-evenly"} flexWrap="wrap">
                      <NextLink href="/">
                        <Center
                          bgColor={"gray.200"}
                          borderRadius={10}
                          p={5}
                          py={2}
                          transition={"transform 0.3s ease"}
                          _hover={{
                            transform: "translateY(-4px)",
                          }}
                          mb={5}
                          w={"45%"}
                          border={"2px solid"}
                          borderColor={"#43B0F1"}
                          shadow={"sm"}
                          cursor={"pointer"}
                        >
                          <Img src={"/aadhaar.png"} height={10} mr={5} />
                          <Flex flexDir={"column"}>
                            <Text fontSize={20} fontWeight={"600"}>
                              Aadhaar Card
                            </Text>
                          </Flex>
                        </Center>
                      </NextLink>
                      <NextLink href="/">
                        <Center
                          bgColor={"gray.200"}
                          borderRadius={10}
                          p={5}
                          py={2}
                          transition={"transform 0.3s ease"}
                          _hover={{
                            transform: "translateY(-4px)",
                          }}
                          w={"45%"}
                          mb={5}
                          border={"2px solid"}
                          borderColor={"#43B0F1"}
                          shadow={"sm"}
                          cursor={"pointer"}
                        >
                          <Img src={"/address.png"} height={10} mr={5} />
                          <Flex flexDir={"column"}>
                            <Text fontSize={20} fontWeight={"600"}>
                              Permanent Address Proof
                            </Text>
                          </Flex>
                        </Center>
                      </NextLink>
                      <NextLink href="/">
                        <Center
                          bgColor={"gray.200"}
                          borderRadius={10}
                          p={5}
                          py={2}
                          transition={"transform 0.3s ease"}
                          _hover={{
                            transform: "translateY(-4px)",
                          }}
                          w={"45%"}
                          border={"2px solid"}
                          borderColor={"#43B0F1"}
                          shadow={"sm"}
                          cursor={"pointer"}
                        >
                          <Img src={"/pan.png"} height={10} mr={5} />
                          <Flex flexDir={"column"}>
                            <Text fontSize={20} fontWeight={"600"}>
                              Signature
                            </Text>
                          </Flex>
                        </Center>
                      </NextLink>
                      <NextLink href="/">
                        <Center
                          bgColor={"gray.200"}
                          borderRadius={10}
                          p={5}
                          py={2}
                          transition={"transform 0.3s ease"}
                          _hover={{
                            transform: "translateY(-4px)",
                          }}
                          w={"45%"}
                          border={"2px solid"}
                          borderColor={"#43B0F1"}
                          shadow={"sm"}
                          cursor={"pointer"}
                        >
                          <Img src={"/camera.png"} height={8} mr={5} opacity={"80%"} />
                          <Flex flexDir={"column"}>
                            <Text fontSize={20} fontWeight={"600"}>
                              Photograph
                            </Text>
                          </Flex>
                        </Center>
                      </NextLink>
                      <NextLink href="/">
                        <Center
                          bgColor={"gray.200"}
                          borderRadius={10}
                          p={5}
                          py={2}
                          transition={"transform 0.3s ease"}
                          _hover={{
                            transform: "translateY(-4px)",
                          }}
                          w={"45%"}
                          border={"2px solid"}
                          borderColor={"#43B0F1"}
                          shadow={"sm"}
                          cursor={"pointer"}
                          mt={5}
                        >
                          <Img src={"/sign.png"} height={10} mr={5} opacity={"80%"} />
                          <Flex flexDir={"column"}>
                            <Text fontSize={20} fontWeight={"600"}>
                              Signature
                            </Text>
                          </Flex>
                        </Center>
                      </NextLink>
                    </Flex>
                    <Flex w={"100%"} justifyContent={"center"} my={20}>
                        <Button
                          display={{ sm: "inline-flex" }}
                          w={"200px"}
                          p={5}
                          fontSize={"md"}
                          fontWeight={600}
                          // eslint-disable-next-line react-hooks/rules-of-hooks
                          color={useColorModeValue("white", "#252525")}
                          borderRadius={"20"}
                          bg={"#43B0F1"}
                          _hover={{
                            bg: "#0065A1",
                            color: "#ffffff",
                          }}
                          onClick={() => {
                            verifyAcc();
                          }}
                        >
                          Verify
                        </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                minH={"130vh"}
                width={"25vw"}
                bgColor={"gray.100"}
                borderLeftColor={"gray.500"}
                flexDir={"column"}
                borderWidth={"2px"}
                padding={10}
              ></Flex>
            </Flex>
          )}
        </Flex>
      </main>
    </div>
  );
}
