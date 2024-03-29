import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import { Center, Grid, GridItem, textDecoration } from "@chakra-ui/react";
import { getETHPrice, getWEIPriceInUSD } from "../../lib/getETHPrice";
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
  InputGroup,
  Input,
  Img,
  Progress,
} from "@chakra-ui/react";
import factory from "../../smart-contract/factory";
import web3 from "../../smart-contract/web3.js";
import Campaign from "../../smart-contract/campaign";
import { ExternalLinkIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { FaHandshake } from "react-icons/fa";
import { FcShare, FcDonate, FcMoneyTransfer } from "react-icons/fc";
import { connectMongo } from "../../utils/connectMongo";
import User from "../../models/user";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import CampaignModel from "../../models/campaignModel";

var cName2Id = {};
var tempUser = {}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
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
  },
});

function SettingsPage({ setSettingsScreen, user }) {
  const [obj, setObj] = useState({});
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const o = JSON.parse(localStorage.getItem("user"));

  const router = useRouter();

  function multiFunct() {
    updateDetails();
    redirect();
  }

  const redirect = () => {
    router.push(user.email);
  };

  async function updateDetails() {
    console.log(user.username);
    console.log(user.firstname);
    console.log(user.lastname);

    if (username == "") user["username"] = user.username;
    else user["username"] = username;
    if (firstName == "") user["firstname"] = user.firstname;
    else user["firstname"] = firstName;
    if (lastName == "") user["lastname"] = user.lastname;
    else user["lastname"] = lastName;
    console.log(user);

    try {
      fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  async function uploadToClient(event) {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      const formData = new FormData();
      formData.append("file", i);
      formData.append("upload_preset", "my-uploads");

      const data = await fetch("https://api.cloudinary.com/v1_1/dhhs7kyyr/image/upload", {
        method: "POST",
        body: formData,
      }).then((r) => r.json());

      user["imageURL"] = data.secure_url;

      setCreateObjectURL(URL.createObjectURL(i));
    }
  }

  useEffect(() => {
    getUser();
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setCampaignListNumber(3);
      return summary;
    } catch (e) {
      console.log(e);
    }
  }

  function getUser() {
    try {
      const o = JSON.parse(localStorage.getItem("user"));
      console.log(o);
      setObj(o);
    } catch (e) {
      console.log("Error in getUser().");
      console.log(e);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Flex w={"100%"} mt={"5vh"} px={"5vw"} flexDir={"column"}>
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
              {o.email}
              <Img height={7} src={"/mail.png"} />
            </Flex>
          </Flex>
          <Flex flexDir={"column"} mt={8}>
            <Text fontSize={18} mb={2}>
              Username
            </Text>
            <InputGroup w={"100%"}>
              <Input
                type="string"
                borderColor={"gray.300"}
                placeholder={"Enter a Username"}
                defaultValue={user.username}
                onChange={(e) => {
                  setUsername(e.currentTarget.value);
                }}
              />
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
                <Input
                  type="string"
                  borderColor={"gray.300"}
                  placeholder={"Enter a First Name"}
                  defaultValue={user.firstname}
                  onChange={(e) => {
                    setFirstName(e.currentTarget.value);
                  }}
                />
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
                <Input
                  type="string"
                  borderColor={"gray.300"}
                  placeholder={"Enter a Last Name"}
                  defaultValue={user.lastname}
                  onChange={(e) => {
                    setLastName(e.currentTarget.value);
                  }}
                />
                <InputRightAddon bgColor={"#9ed1f0"}>
                  <Img src="/edit.png" h={6} />
                </InputRightAddon>
              </InputGroup>
            </Flex>
          </Flex>

          <Button mt={10} bgColor={"blue.200"} onClick={multiFunct}>
            Submit
          </Button>
          {!tempUser.verificationComplete ?
            (<><Text fontSize={24} fontWeight={"400"} mt={10}>
              Account Verification
            </Text><NextLink href={{
              pathname: `/user/kycExplore`,
            }}>
                <Button mt={3} bgColor={"blue.200"}>
                  Verify your account
                </Button>
              </NextLink></>)
            : console.log("H")}
        </Flex>
        <Flex w={"40%"} flexDir={"column"} pl={10}>
          <Text fontSize={24} fontWeight={"400"} mt={4}>
            Profile picture
          </Text>
          <Center w={"100%"}>
            <Center mt={8} ml={8} pos="relative">
              <Img
                src={user.imageURL ? user.imageURL : o.picture}
                h={"25vh"}
                borderRadius={"50%"}
                objectFit={"cover"}
              />
              <Button h={16} w={16} bgColor={"blue.300"} borderRadius={"50%"} pos={"absolute"} bottom={0} right={0}>
                <Img src="/edit.png" objectFit={"cover"} h={7} />
                <Input
                  type={"file"}
                  name="myImage"
                  onChange={uploadToClient}
                  display={"inline-block"}
                  visibility={"visible"}
                  opacity={"0%"}
                  w={"100%"}
                  h={"100%"}
                  bgColor={"transparent"}
                  border={"0px"}
                  position={"absolute"}
                />
              </Button>
            </Center>
          </Center>
        </Flex>
      </Flex>
    </Flex>
  );
}

function CampaignCardNew({ name, description, creatorId, imageURL, id, balance, target, ethPrice }) {
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

function LatestActivity({ dbCampaign, chainCampaign, campaigns, user }) {
  return (
    <Flex h={"100vh"} p={0} w={"100%"} maxW={"100%"}>
      <SimpleGrid row={{ base: 1, md: 3 }} spacing={10}>
        {chainCampaign.map((el, i) => {
          var donatedArr = user.donatedCampaigns;
          for (var ele in donatedArr) {
            var camp = donatedArr[ele];
            for (var j = 0; j < dbCampaign.length; j++) {
              if (dbCampaign[j].name == camp) {
                if (el[5] == camp) {
                  return (
                    <NextLink href={`/campaign/${cName2Id[el[5]]}`}>
                      <Box
                        h={"17vh"}
                        w={"100%"}
                        minW={"100%"}
                        maxW={"55%"}
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
                        <Box h={"100%"} maxW={"40%"} borderRadius={"20"} borderRightRadius={"0"}>
                          <Img
                            src={dbCampaign[j].imageUrl}
                            alt={`Picture of ${el[5]}`}
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
                          minW={"60%"}
                          maxW={"60%"}
                          borderRadius={"20"}
                          borderLeftRadius={"0"}
                          padding={"1rem"}
                          px={"0.5rem"}
                          display={"flex"}
                          flexDirection={"column"}
                          justifyContent={"space-between"}
                          pb={"1.5rem"}
                        >
                          <Box minW={"100%"} maxW={"100%"}>
                            <Box fontSize="2xl" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1}>
                              {el[5]}
                            </Box>
                            <Box minW={"100%"} maxW={"100%"}>
                              <Text noOfLines={3}>{el[6]}</Text>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </NextLink>
                  );
                }
              }
            }
          }
        })}
      </SimpleGrid>
    </Flex>
  );
}

function ActiveCampaigns({ setActivePending, campaignList, campaignList1, campaigns, ethPrice }) {
  var ab;
  useEffect(() => { }, []);
  return (
    <Flex w={"100%"} h={"20vh"} flexDir={"column"}>
      <Flex mb={3}>
        <Heading fontSize={30} mr={10}>
          Active Campaigns
        </Heading>
        <Heading
          fontSize={30}
          color={"gray.500"}
          onClick={() => {
            setActivePending(1);
          }}
          cursor={"pointer"}
        >
          Pending Campaigns
        </Heading>
      </Flex>
      <Flex minH={"100vh"} maxH={"100vh"} overflowY={"scroll"} justifyContent={"flex-start"} alignItems={"flex-start"}>
        <SimpleGrid row={{ base: 1, md: 3 }} spacing={10} py={8}>
          {campaignList.map((el, i) => {
            for (var k = 0; k < campaignList1.length; k++) {
              if (el[5] == campaignList1[k].name && campaignList1[k].isApproved == true) {
                return (
                  <div key={i}>
                    <CampaignCardNew
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

function PendingCampaigns({ setActivePending, campaignList, campaignList1, campaigns, ethPrice }) {
  useEffect(() => {
    console.log("in PENDING");
    console.log(campaignList);
    console.log(campaignList1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Flex w={"100%"} h={"20vh"} flexDir={"column"}>
      <Flex>
        <Heading
          fontSize={30}
          mr={10}
          color={"gray.500"}
          onClick={() => {
            setActivePending(0);
          }}
          cursor={"pointer"}
        >
          Active Campaigns
        </Heading>
        <Heading fontSize={30}>Pending Campaigns</Heading>
      </Flex>
      <Flex minH={"100vh"} maxH={"100vh"} overflowY={"scroll"} justifyContent={"flex-start"} alignItems={"flex-start"}>
        <SimpleGrid py={8} spacing={10}>
          {campaignList.map((el, i) => {
            for (var k = 0; k < campaignList1.length; k++) {
              if (el[5] == campaignList1[k].name && campaignList1[k].isApproved == false) {
                return (
                  <div key={i}>
                    <CampaignCardNew
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

export default function UserProfile({ campaigns, users, dbCamp }) {
  const [activePending, setActivePending] = useState(false);
  const [settingsScreen, setSettingsScreen] = useState(false);
  const [campaignList, setCampaignList] = useState([]);
  const [campaignList1, setCampaignList1] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);
  const [campaignListNumber, setCampaignListNumber] = useState(0);
  const [user, setUser] = useState({});
  const [obj, setObj] = useState({});
  const [donatedAmount, setDonatedAmount] = useState(0.0);
  const [noCreatedCampaigns, setNoCreatedCampigns] = useState(0);
  const [noDonatedCampaigns, setNoDonatedCampigns] = useState(0);
  var ab;

  async function getSummary() {
    try {
      const tempArr = getCampaigns();
      setCampaignList1(tempArr);
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
      setCampaignListNumber(3);
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
          tempUser = users[i];
          setUser(users[i]);
          setDonatedAmount(users[i].donatedAmount);
          setNoCreatedCampigns(users[i].createdCampaigns.length);
          setNoDonatedCampigns(users[i].donatedCampaigns.length);
          break;
        }
      }
    } catch (e) {
      console.log("Error in getUser().");
      console.log(e);
    }
  }

  function getCampaigns() {
    const u = localStorage.getItem("email");
    var arr = [];
    for (var i = 0; i < dbCamp.length; i++) {
      if (dbCamp[i].creatorEmail == u) arr.push(dbCamp[i]);
    }
    setCampaignList1(arr);
    return arr;
  }

  useEffect(() => {
    getUser();
    getSummary();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Head>
        <title>User Profile | CryptAid</title>
        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container
          maxWidth={"100vw"}
          padding={0}
          margin={0}
          mt={-5}
          alignItems={"flex-start"}
          display={"flex"}
          flexDirection={"row"}
        >
          <Flex height={"200vh"} width={"20vw"} bgColor={"gray.200"}></Flex>
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
                  src={user.imageURL ? user.imageURL : obj.picture}
                  alt="Profile Picture"
                  h={"9vw"}
                  w={"9vw"}
                  objectFit={"fill"}
                  borderRadius={"50%"}
                ></Img>
              </Center>
              <Flex w={"79%"} justifyContent={"space-between"} pr={"10%"} alignItems={"center"}>
                <Flex flexDir={"column"}>
                  <Flex flexDir={"row"} mt={"50%"} alignItems={"center"}>
                    <Text fontSize={30} fontWeight={800} color={"blue.800"} >
                      {user.username ? user.username : obj.nickname}
                    </Text>
                    {tempUser.verificationComplete ? (<CheckCircleIcon color={"blue.500"} boxSize={6} ml={3} mt={1} />) : console.log("HII")}
                  </Flex>

                  <Text fontSize={15} fontWeight={300}>
                    {obj.email}
                  </Text>
                </Flex>
                <Flex mt={"14%"}>
                  <Button
                    w={"56px"}
                    h={"56px"}
                    bgColor={"gray.300"}
                    borderRadius={"56px"}
                    onClick={() => {
                      setSettingsScreen(!settingsScreen);
                    }}
                  >
                    <Img objectFit={"contain"} src={"/settings.png"} />
                  </Button>
                </Flex>
              </Flex>
            </Flex>
            {settingsScreen ? (
              <Flex>
                <SettingsPage setSettingsScreen={setSettingsScreen} user={user} />
              </Flex>
            ) : (
              <Flex flexDirection={"column"}>
                <Flex w={"100%"} mt={"5%"} px={"10%"} py={5} flexDirection={"column"}>
                  <Heading mb={6} fontSize={30}>
                    Dashboard
                  </Heading>
                  <Flex flexDirection={"row"} width={"100%"} justifyContent={"space-between"}>
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
                        <Text fontSize={16}>Total amount contributed</Text>
                        <Text fontSize={26} fontWeight={600} color={"blue.500"}>
                          ${donatedAmount ? donatedAmount.toFixed(2) : "0.00"}
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
                        <Text fontSize={16}>Total campaigns created</Text>
                        <Text fontSize={26} fontWeight={600} color={"blue.500"}>
                          {noCreatedCampaigns}
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
                      <Img src={"/totalcampaigns.png"} height={10} mr={5} />
                      <Flex flexDir={"column"}>
                        <Text fontSize={16}>Total campaigns funded</Text>
                        <Text fontSize={26} fontWeight={600} color={"blue.500"}>
                          {noDonatedCampaigns}
                        </Text>
                      </Flex>
                    </Center>
                  </Flex>
                </Flex>
                <Flex w={"100%"} px={"10%"} py={5} flexDirection={"column"}>
                  {activePending ? (
                    <PendingCampaigns
                      setActivePending={setActivePending}
                      campaignList={campaignList}
                      campaignList1={campaignList1}
                      campaigns={campaigns}
                      ethPrice={ethPrice}
                    />
                  ) : (
                    <ActiveCampaigns
                      setActivePending={setActivePending}
                      campaignList={campaignList}
                      campaignList1={campaignList1}
                      campaigns={campaigns}
                      ethPrice={ethPrice}
                    />
                  )}
                </Flex>
              </Flex>
            )}
          </Flex>
          <Flex
            height={"200vh"}
            width={"25vw"}
            bgColor={"gray.200"}
            borderLeftColor={"gray.500"}
            flexDir={"column"}
            padding={10}
            px={5}
            alignItems={"center"}
          >
            <Center bgColor={"gray.300"} borderRadius={10} p={5} py={2} w={"60%"} justifyContent={"flex-start"}>
              <Img src={"/user.png"} height={10} mr={8} />
              <Flex flexDir={"column"}>
                <Text fontSize={22} fontWeight={600} noOfLines={1}>
                  {user.username ? user.username : obj.nickname}
                </Text>
                <Center justifyContent={"flex-start"}>
                  <Flex h={2} w={2} borderRadius={"50%"} bgColor={"green.300"} mr={3}></Flex>
                  <Text fontSize={16} color={"gray.500"}>
                    Online
                  </Text>
                </Center>
              </Flex>
            </Center>
            <Flex flexDir={"column"} mt={5} mb={5} maxH={"65vh"} overflowY={"auto"} overflowX={"hidden"} w={"100%"}>
              <Text fontSize={24} fontWeight={600} mb={5} mt={2}>
                My Donations
              </Text>
              <LatestActivity dbCampaign={dbCamp} chainCampaign={campaignList} campaigns={campaigns} user={user} />
            </Flex>
          </Flex>
        </Container>
      </main>
    </div>
  );
}
