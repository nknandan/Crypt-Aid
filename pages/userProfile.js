import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { Center, Grid, GridItem, textDecoration } from "@chakra-ui/react";
import { getETHPrice, getWEIPriceInUSD } from "../lib/getETHPrice";
import {
  Heading,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Container,
  SimpleGrid,
  Box,
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

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  await connectMongo();
  const users = await User.find();

  return {
    props: { campaign: campaigns, users: JSON.parse(JSON.stringify(users)) },
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
            ></Box>

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
              value={balance}
              max={target}
              mt="2"
            />
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
}

function LatestActivity({ name, description, imageURL }) {
  return (
    <NextLink href={`/explore`}>
      <Flex
        h={"20vh"}
        borderRadius={20}
        p={0}
        bgColor={"gray.200"}
        w={"100%"}
        transition={"transform 0.3s ease"}
        boxShadow="sm"
        _hover={{
          transform: "translateY(-4px)",
        }}
        cursor={"pointer"}
        my={4}
      >
        <Img
          src="/dummy.png"
          h={"100%"}
          minW={"40%"}
          maxW={"40%"}
          objectFit={"cover"}
          borderRadius={20}
        />
        <Flex
          flexDirection={"column"}
          p={"4%"}
          justifyContent={"space-between"}
        >
          <Flex flexDirection={"column"}>
            <Text fontSize={24} fontWeight={"500"}>
              {name}
            </Text>
            <Text noOfLines={3} lineHeight={"20px"}>
              {description}
              {description}
              {description}
            </Text>
          </Flex>
          <Flex w={"100%"} justifyContent={"flex-end"}>
            <Button bgColor={"blue.200"} fontSize={12} p={3} h={2}>
              Read More
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </NextLink>
  );
}

function ActiveCampaigns({
  setActivePending,
  campaignList,
  campaigns,
  ethPrice,
}) {
  return (
    <Flex w={"100%"} h={"20vh"} flexDir={"column"}>
      <Flex>
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
      <Flex minH={"100vh"} maxH={"100vh"} overflowY={"auto"}>
        <SimpleGrid row={{ base: 1, md: 3 }} spacing={10} py={8}>
          {campaignList.map((el, i) => {
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
  );
}

function PendingCampaigns({
  setActivePending,
  campaignList,
  campaigns,
  ethPrice,
}) {
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
      <Flex minH={"100vh"} maxH={"100vh"} overflowY={"auto"}>
        <SimpleGrid row={{ base: 1, md: 3 }} spacing={10} py={8}>
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
  );
}

export default function UserProfile({ campaigns, users }) {
  const [activePending, setActivePending] = useState(0);
  const [campaignList, setCampaignList] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);
  const [campaignListNumber, setCampaignListNumber] = useState(0);

  async function getSummary() {
    try {
      const summary = await Promise.all(
        campaigns.map((campaign, i) =>
          Campaign(campaigns[i]).methods.getSummary().call()
        )
      );
      const ethPrice = await getETHPrice();
      updateEthPrice(ethPrice);
      setCampaignList(summary);
      setCampaignListNumber(3);
      return summary;
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obj = localStorage.getItem("user");
  const u = JSON.parse(obj);
  for (var i = 0; i < users.length; i++) {
    if (users[i].email == u.email) {
      var user = users[i];
      break;
    }
  }
  console.log(user);

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
          maxWidth={"100vw"}
          padding={0}
          margin={0}
          mt={-5}
          alignItems={"flex-start"}
          display={"flex"}
          flexDirection={"row"}
        >
          <Flex height={"200vh"} width={"20vw"} bgColor={"gray.200"}></Flex>
          <Flex
            height={"200vh"}
            width={"55vw"}
            bgColor={"gray.100"}
            flexDirection={"column"}
          >
            <Flex
              w={"90%"}
              h={"20vh"}
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
              top={"15vh"}
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
              top={"27vh"}
              left={"35vw"}
            >
              <Text fontSize={30} fontWeight={800} color={"blue.800"}>
                {user.username}
              </Text>
              <Text fontSize={15} fontWeight={300} mt={-2}>
                {user.email}
              </Text>
            </Flex>
            <Button
              w={"6vh"}
              h={"6vh"}
              bgColor={"gray.300"}
              pos={"absolute"}
              left={"65vw"}
              top={"28vh"}
              borderRadius={"50%"}
            >
              <Img objectFit={"cover"} src={"/settings.png"} />
            </Button>
            <Flex
              w={"100%"}
              mt={"12%"}
              px={"10%"}
              py={5}
              flexDirection={"column"}
            >
              <Heading mb={6} fontSize={30}>
                Dashboard
              </Heading>
              <Flex
                flexDirection={"row"}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Center
                  bgColor={"gray.200"}
                  borderRadius={10}
                  p={5}
                  py={2}
                  _hover={{
                    transform: "translateX(8px)",
                  }}
                >
                  <Img src={"/totalamount.png"} height={10} mr={5} />
                  <Flex flexDir={"column"}>
                    <Text fontSize={16}>Total amount contributed</Text>
                    <Text fontSize={26} fontWeight={600} color={"blue.500"}>
                      $ 69.99
                    </Text>
                  </Flex>
                </Center>
                <Center
                  bgColor={"gray.200"}
                  borderRadius={10}
                  p={5}
                  py={2}
                  _hover={{
                    transform: "translateX(8px)",
                  }}
                >
                  <Img src={"/totalcreated.png"} height={10} mr={5} />
                  <Flex flexDir={"column"}>
                    <Text fontSize={16}>Total campaigns created</Text>
                    <Text fontSize={26} fontWeight={600} color={"blue.500"}>
                      0
                    </Text>
                  </Flex>
                </Center>
                <Center
                  bgColor={"gray.200"}
                  borderRadius={10}
                  p={5}
                  py={2}
                  _hover={{
                    transform: "translateX(8px)",
                  }}
                >
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
              {activePending ? (
                <PendingCampaigns
                  setActivePending={setActivePending}
                  campaignList={campaignList}
                  campaigns={campaigns}
                  ethPrice={ethPrice}
                />
              ) : (
                <ActiveCampaigns
                  setActivePending={setActivePending}
                  campaignList={campaignList}
                  campaigns={campaigns}
                  ethPrice={ethPrice}
                />
              )}
            </Flex>
          </Flex>
          <Flex
            height={"200vh"}
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
                  {user.username}
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
              w={"100%"}
            >
              <Text fontSize={24} fontWeight={600} mb={5} mt={2}>
                Recent Donations
              </Text>
              <LatestActivity
                name={"Hi alvin"}
                description={
                  "save alvin antony shaju.do this project.pls.lalalallalal"
                }
                imageURL={"randomimageurl"}
              />
              <LatestActivity
                name={"Hi alvin"}
                description={
                  "save alvin antony shaju.do this project.pls.lalalallalal"
                }
                imageURL={"randomimageurl"}
              />
              <LatestActivity
                name={"Hi alvin"}
                description={
                  "save alvin antony shaju.do this project.pls.lalalallalal"
                }
                imageURL={"randomimageurl"}
              />
            </Flex>
          </Flex>
        </Container>
      </main>
    </div>
  );
}
