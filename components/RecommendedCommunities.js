import { Box, Flex,  Button, Text, SimpleGrid, Heading, Img, Spinner, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import Campaign from "../smart-contract/campaign";
import factory from "../smart-contract/factory";
import { getETHPrice } from "../lib/getETHPrice";
import web3 from "../smart-contract/web3";

function CommunityCard({ name, description, imageURL, moderators, members, commCamps, commPosts, dbUsers }) {

  const [joined, setJoined] = useState(1);
  const [memberNo, setMemberNo] = useState();
  const [modNo, setModNo] = useState();
  const [postCount, setPostCount] = useState();
  var tempUser = {};
  var tempMod = [];
var tempMem = [];
  useEffect(() => {

    if (members == undefined) setMemberNo(0);
    else setMemberNo(members.length);
    setModNo(moderators.length);
    const fetchData = async () => { };
    fetchData();
    var userEmail = localStorage.getItem("email");
    var tempName = name;
    setPostCount(commPosts.length);
    // console.log(users);
    for (let i = 0; i < dbUsers.length; i++) {
      if (dbUsers[i].email == userEmail) {
        tempUser = dbUsers[i];
      }
    }
    tempMod = moderators || [];
    tempMem = members || [];
    if (tempMem.includes(userEmail) || tempMod.includes(userEmail))
      setJoined(1);
    else
      setJoined(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NextLink href={`/community/${encodeURIComponent(name)}`}>
      <Box
        minH={"250px"}
        w={"400px"}
        position="relative"
        cursor="pointer"
        bgColor={"#ffffff"}
        borderRadius={"20"}
        transition={"transform 0.3s ease"}
        boxShadow="sm"
        _hover={{
          transform: "translateY(-8px)",
        }}
        overflow={"hidden"}
        zIndex={95}
        display={"flex"}
        flexDir={"column"}
        justifyContent={"space-between"}
        paddingBottom={"5%"}
      >
        <Box h={"100px"} w={"100%"} bgColor={"black"} overflow={"hidden"} position="relative">
          <Box h={"100px"} w={"100%"} position="relative">
            <Img
              src={imageURL}
              alt={`Picture of ${name}`}
              objectFit="cover"
              w="full"
              h="full"
              display="block"
              opacity={"0.5"}
              position={"absolute"}
            />
          </Box>
        </Box>
        <Text
          maxW={"260px"}
          noOfLines={1}
          color={"white"}
          fontSize={"24px"}
          opacity={"1"}
          zIndex={99}
          position="absolute"
          top={"65px"}
          left={"20px"}
          fontWeight={800}
        >
          {name}
        </Text>
        <Box bgColor={"white"} paddingLeft={"20px"} paddingRight={"20px"} minH={"30%"}>
          <Text noOfLines={3}>{description}</Text>
        </Box>
        <Flex
          flexDir={"row"}
          paddingLeft={"20px"}
          paddingRight={"20px"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontWeight={600} color={"#2C2C7B"}>
            {postCount} posts
          </Text>
          <Text fontWeight={600} color={"#2C2C7B"}>
            {memberNo + modNo} members
          </Text>
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
            <></>
          )}
        </Flex>
      </Box>
    </NextLink>
  );
}


export default function RecommendedCommunities({ name, description, dbComm, dbUsers }) {
  // Hold the campaigns data from Blockchain
  const [campaignList, setCampaignList] = useState([]);
  const [dataDispNames, setDataDispNames] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);
  const [loadingRecom, setLoadingRecom] = useState(1);

  const fetchRecommendedCommunities = async () => {
    try {
      let dispTemparr = [];
      fetch("/api/communities/recommComm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, description: description }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let reqArr = data["dsArr"];
          setLoadingRecom(0);
          let i = 0;
          for (let ele of reqArr) {
            if (i > 2) break;
            dispTemparr.push(ele[0]);
            i++;
          }
          setDataDispNames(dispTemparr);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setDataDispNames(dataDispNames);
  }, [dataDispNames]);

  useEffect(() => {
    fetchRecommendedCommunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description]);

  useEffect(() => {
    fetchRecommendedCommunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description]);

  return (
    <Flex w={"100%"} flexDir={"column"}>
      <Flex mb={3}>
        <Heading fontSize={36} mr={10} color={"blue.600"}>
          Interesting Communities that you may like...
        </Heading>
      </Flex>
      {loadingRecom ? (
        <Center w={"100%"} p={"10vh"}>
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Center>
      ) : (
        <Flex maxH={"100vh"} overflowY={"auto"}>
          <SimpleGrid row={{ base: 1, md: 3 }} spacing={10} py={8}>
            {dataDispNames.map((ele, i) => {
              for (var k = 0; k < dbComm.length; k++) {
                if (ele === dbComm[k].name) {
                  let el = dbComm[k];
                  {
                    return (
                      <div key={i}>
                        <CommunityCard
                          name={el.name}
                          description={el.description}
                          imageURL={el.imageUrl}
                          moderators={el.moderators}
                          commPosts={el.posts}
                          dbUsers={dbUsers}
                        />
                      </div>
                    );
                  }
                }
              }
            })}
          </SimpleGrid>
        </Flex>
      )}
    </Flex>
  );
}
