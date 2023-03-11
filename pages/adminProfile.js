import Head from "next/head";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { Center, Grid, GridItem, textDecoration } from "@chakra-ui/react";
import { getETHPrice, getWEIPriceInUSD } from "../lib/getETHPrice";
import NavbarAdmin from "../components/NavbarAdmin";
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
} from "@chakra-ui/react";
import factory from "../smart-contract/factory";
import web3 from "../smart-contract/web3";
import Campaign from "../smart-contract/campaign";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { FaHandshake } from "react-icons/fa";
import { FcShare, FcDonate, FcMoneyTransfer } from "react-icons/fc";
import { connectMongo } from "../utils/connectMongo";
import User from "../models/user";
import CampaignModel from "../models/campaignModel";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

var cName2Id = {};

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

function SettingsPage({ setSettingsScreen, users }) {
  const [user, setUser] = useState({});
  const [obj, setObj] = useState({});

  async function getSummary() {
    try {
      const summary = await Promise.all(
        campaigns.map((campaign, i) => Campaign(campaigns[i]).methods.getSummary().call())
      );
      const ETHPrice = await getETHPrice();
      updateEthPrice(ETHPrice);
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
      console.log(o);
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

  useEffect(() => {
    getUser();
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex w={"100%"} mt={"15vh"} px={"5vw"} flexDir={"column"}>
      <Center justifyContent={"flex-start"} borderBottomWidth={1} borderColor={"blue.800"} py={2}>
        <Button p={0} mr={"2vh"} bgColor={"transparent"}>
          <Img
            src={"/back.png"}
            h={"4vh"}
            objectFit={"contain"}
            onClick={() => {
              setSettingsScreen(0);
            }}
          />
        </Button>
        <Text fontSize={30} fontWeight={"600"}>
          Account Settings
        </Text>
      </Center>
      <Flex w={"100%"}>
        <Flex w={"60%"} flexDir={"column"}>
          <Text fontSize={24} fontWeight={"400"} mt={4}>
            User Information
          </Text>
          <Text fontSize={18} color={"gray"}>
            Here you can edit public information about yourself.
          </Text>
          <Text fontSize={18} color={"gray"} mt={-1}>
            The changes will be displayed to other users within 5 minutes.
          </Text>
          <Flex flexDir={"column"} mt={10}>
            <Text fontSize={18} mb={2}>
              Email address
            </Text>
            <Flex
              cursor={"no-drop"}
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
              {obj.email}
              <Img height={7} src={"/mail.png"} />
            </Flex>
          </Flex>
          <Flex flexDir={"column"} mt={8}>
            <Text fontSize={18} mb={2}>
              Username
            </Text>
            <InputGroup w={"100%"}>
              <Input type="string" borderColor={"gray.300"} placeholder={obj.nickname} />
              <InputRightAddon bgColor={"#9ed1f0"}>
                <Img src="/edit.png" h={6} />
              </InputRightAddon>
            </InputGroup>
          </Flex>
          <Flex mt={8} justifyContent={"space-between"}>
            <Flex flexDir={"column"}>
              <Text fontSize={18} mb={2}>
                First name
              </Text>
              <InputGroup w={"100%"}>
                <Input type="string" borderColor={"gray.300"} placeholder={"First Name"} />
                <InputRightAddon bgColor={"#9ed1f0"}>
                  <Img src="/edit.png" h={6} />
                </InputRightAddon>
              </InputGroup>
            </Flex>
            <Flex flexDir={"column"}>
              <Text fontSize={18} mb={2}>
                Last name
              </Text>
              <InputGroup w={"100%"}>
                <Input type="string" borderColor={"gray.300"} placeholder={"Last Name"} />
                <InputRightAddon bgColor={"#9ed1f0"}>
                  <Img src="/edit.png" h={6} />
                </InputRightAddon>
              </InputGroup>
            </Flex>
          </Flex>
        </Flex>
        <Flex w={"40%"} flexDir={"column"} pl={10}>
          <Text fontSize={24} fontWeight={"400"} mt={4}>
            Profile picture
          </Text>
          <Center w={"100%"}>
            <Center mt={8} ml={8} pos="relative">
              <Img src={obj.picture} h={"25vh"} borderRadius={"50%"} objectFit={"cover"} />
              <Button h={16} w={16} bgColor={"blue.300"} borderRadius={"50%"} pos={"absolute"} bottom={0} right={0}>
                <Img src="/edit.png" objectFit={"cover"} h={7} />
              </Button>
            </Center>
          </Center>
        </Flex>
      </Flex>
    </Flex>
  );
}

function ApprovedCard({ name, description, creatorId, imageURL, id, balance, target, ethPrice }) {
  return (
    <NextLink href={`/campaign/${id}`}>
      <Box
        h={"20vh"}
        w={"100%"}
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
            <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}></Box>

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
            <Progress colorScheme="blue" size="sm" value={balance} max={target} mt="2" />
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
}

function PendingCard({
  name,
  description,
  approvedPending,
  // creatorId,
  imageURL,
  id,
  balance,
  target,
  ethPrice,
  setCampaignList,
  campaignList,
}) {
  const router = useRouter();

  function multiFunct() {
    updateStatus();
    setCampaignList(campaignList);
    redirect();
    // window.location.reload();
  }
  useEffect(() => {}, [campaignList]);

  const redirect = () => {
    router.reload("/");
  };

  async function updateStatus() {
    const tempObj = { name: name, isApproved: true };
    try {
      await fetch("/api/campaign/create", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempObj }),
      });
    } catch (err) {
      // setError(err.message);
      console.log(err);
    }
  }

  return (
    <Box
      h={"20vh"}
      w={"100%"}
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
      zIndex={1}
    >
      <NextLink href={`/campaign/${id}`}>
        <Box h={"100%"} w={"25%"} borderRadius={"20"} borderRightRadius={"0"} zIndex={1}>
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
      </NextLink>
      <NextLink href={`/campaign/${id}`}>
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
          zIndex={1}
        >
          <Box>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}></Box>

            <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight">
              {name}
            </Box>
            <Box maxW={"60%"}>
              <Text noOfLines={3}>{description}</Text>
            </Box>
          </Box>
          <Box>
            <Flex>
              <Box maxW={{ base: "	15rem", sm: "sm" }}></Box>
              <Text fontSize={"md"} fontWeight="normal">
                Target : {web3.utils.fromWei(target, "ether")} ETH ($
                {getWEIPriceInUSD(ethPrice, target)})
              </Text>
            </Flex>
          </Box>
        </Box>
      </NextLink>
      {approvedPending ? (
        <> </>
      ) : (
        <Flex
          justifyContent={"space-between"}
          zIndex={99}
          marginRight={"5%"}
          pos={"absolute"}
          right={"1%"}
          bottom={"15%"}
        >
          <Button bgColor={"green.200"} fontSize={12} p={3} h={2} onClick={multiFunct} component="a">
            Approve
          </Button>
        </Flex>
      )}
    </Box>
  );
}

// This function shows the Pending Campaigns
function PendingCampaigns({ setApprovedPending, campaignList, campaignList1, campaigns, ethPrice, setCampaignList }) {
  return (
    <Flex w={"100%"} h={"20vh"} flexDir={"column"}>
      <Flex mb={3}>
        <Heading fontSize={30} mr={10}>
          Pending Campaigns
        </Heading>
        <Heading
          fontSize={30}
          color={"gray.500"}
          onClick={() => {
            setApprovedPending(1);
          }}
          cursor={"pointer"}
        >
          Approved Campaigns
        </Heading>
      </Flex>
      <Flex>
        <SimpleGrid spacing={10} py={8} overflowY={"auto"} maxH={"100vh"}>
          {campaignList.map((el, i) => {
            for (var k = 0; k < campaignList1.length; k++) {
              if (campaignList1[k].isApproved == false && campaignList1[k].name == el[5]) {
                return (
                  <div key={i}>
                    <PendingCard
                      name={el[5]}
                      description={el[6]}
                      creatorId={el[4]}
                      imageURL={el[7]}
                      id={cName2Id[el[5]]}
                      target={el[8]}
                      balance={el[1]}
                      ethPrice={ethPrice}
                      setCampaignList={setCampaignList}
                      campaignList={campaignList}
                    />
                  </div>
                );
              }
            }
          })}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}

// This function shows the Approved Campaigns
function ApprovedCampaigns({ setApprovedPending, campaignList, campaignList1, campaigns, ethPrice }) {
  return (
    <Flex w={"100%"} h={"20vh"} flexDir={"column"}>
      <Flex>
        <Heading
          fontSize={30}
          mr={10}
          color={"gray.500"}
          onClick={() => {
            setApprovedPending(0);
          }}
          cursor={"pointer"}
        >
          Pending Campaigns
        </Heading>
        <Heading fontSize={30}>Approved Campaigns</Heading>
      </Flex>
      <Flex>
        <SimpleGrid spacing={10} py={8} overflowY={"auto"} maxH={"100vh"}>
          {campaignList.map((el, i) => {
            for (var k = 0; k < campaignList1.length; k++) {
              if (campaignList1[k].isApproved == true && campaignList1[k].name == el[5]) {
                return (
                  <div key={i}>
                    <ApprovedCard
                      name={el[5]}
                      description={el[6]}
                      creatorId={el[4]}
                      imageURL={el[7]}
                      id={cName2Id[el[5]]}
                      target={el[8]}
                      balance={el[1]}
                      ethPrice={ethPrice}
                    />
                  </div>
                );
              }
            }
          })}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}

export default function AdminProfile({ campaigns, users, dbCamp }) {
  const [approvedPending, setApprovedPending] = useState(false);
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

  async function getDbCampaigns() {
    let res = await fetch("/api/campaign/create", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let dbCamp = await res.json();
    console.log(dbCamp);
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
    getDbCampaigns();
    getUser();
    getSummary();
    getNumber();
    if (localStorage.getItem("adminAuth") === "true") {
      setAdminLogIn(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Head>
        <title>Admin Profile | CryptAid</title>
        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Flex minH={"100vh"}>
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
            <Container
              maxW={"100vw"}
              minH={"100vh"}
              scrollBehavior={"auto"}
              bgColor={"white"}
              zIndex={"1000"}
              p={0}
              m={0}
              alignItems={"flex-start"}
              display={"flex"}
              flexDirection={"row"}
              position={"absolute"}
              top={0}
              left={0}
            >
              <NavbarAdmin />
              <Flex height={"200vh"} width={"25vw"} bgColor={"gray.100"} borderRightColor={"gray.500"}></Flex>
              <Flex height={"200vh"} width={"55vw"} bgColor={"gray.100"} flexDirection={"column"}>
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
                  <Button
                    color={"red"}
                    onClick={() => {
                      getDbCampaigns();
                    }}
                  >
                    DEBUG{" "}
                  </Button>
                  <Flex w={"100%"} mt={"5%"} px={"10%"} py={5} flexDirection={"column"}>
                    <Heading mb={6} fontSize={30}>
                      Dashboard
                    </Heading>
                    <Flex flexDirection={"row"} width={"100%"} justifyContent={"space-evenly"}>
                      <Center
                        bgColor={"gray.200"}
                        borderRadius={10}
                        p={5}
                        py={2}
                        transition={"transform 0.3s ease"}
                        _hover={{
                          transform: "translateX(8px)",
                        }}
                      >
                        <Img src={"/totalamount.png"} height={10} mr={5} />
                        <Flex flexDir={"column"}>
                          <Text fontSize={16}>Campaigns to approve</Text>
                          <Text fontSize={26} fontWeight={600} color={"blue.500"}>
                            {notApprovedNumber}
                          </Text>
                        </Flex>
                      </Center>
                      <Center
                        bgColor={"gray.200"}
                        borderRadius={10}
                        p={5}
                        py={2}
                        transition={"transform 0.3s ease"}
                        _hover={{
                          transform: "translateX(8px)",
                        }}
                      >
                        <Img src={"/totalcreated.png"} height={10} mr={5} />
                        <Flex flexDir={"column"}>
                          <Text fontSize={16}>Total Campaigns Approved</Text>
                          <Text fontSize={26} fontWeight={600} color={"blue.500"}>
                            {approvedNumber}
                          </Text>
                        </Flex>
                      </Center>
                    </Flex>
                  </Flex>
                  <Flex w={"100%"} px={"10%"} py={5} flexDirection={"column"}>
                    {approvedPending ? (
                      <ApprovedCampaigns
                        setApprovedPending={setApprovedPending}
                        campaignList={campaignList}
                        campaignList1={dbCamp}
                        campaigns={campaigns}
                        ethPrice={ethPrice}
                      />
                    ) : (
                      <PendingCampaigns
                        setApprovedPending={setApprovedPending}
                        campaignList={campaignList}
                        campaignList1={dbCamp}
                        campaigns={campaigns}
                        ethPrice={ethPrice}
                        setCampaignList={setCampaignList}
                      />
                    )}
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                height={"200vh"}
                width={"25vw"}
                bgColor={"gray.100"}
                borderLeftColor={"gray.500"}
                flexDir={"column"}
                padding={10}
              ></Flex>
            </Container>
          )}
        </Flex>
      </main>
    </div>
  );
}
