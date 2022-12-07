import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  SimpleGrid,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Container,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  InputGroup,
  Input,
  Img,
  useOutsideClick,
  MenuItem,
  Spinner,
  Center,
} from "@chakra-ui/react";

import { useEffect, useState, useRef } from "react";
import NextLink from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useWallet } from "use-wallet";
import Campaign from "../smart-contract/campaign";
import factory from "../smart-contract/factory";
import SearchTable from "./searchTable";
import { useUser } from "@auth0/nextjs-auth0";
import { getETHPrice, getETHPriceInUSD, getWEIPriceInUSD } from "../lib/getETHPrice";
import web3 from "../smart-contract/web3";

var cName2Id = {};
// var dataDispNames = [];

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
              <Box maxW={{ base: "	15rem", sm: "sm" }}></Box>
              <Text fontSize={"md"} fontWeight="normal">
                Target : {web3.utils.fromWei(target, "ether")} ETH{" "}
              </Text>
            </Flex>
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
}

export default function RecommendedCampaigns({ name, description }) {
  const [campaignList, setCampaignList] = useState([]);
  const [sortedRecomm, setSortedRecomm] = useState([]);
  const [dataDispNames, setDataDispNames] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);
  const [loadingRecom, setLoadingRecom] = useState(1);

  const fetchRecommendedCampaigns = async (summary) => {
    try {
      let dispTemparr = [];
      fetch("/api/campaign/recomm", {
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
          console.log(summary);
          let disp = [];
          let reqArr = data["dsArr"];
          setLoadingRecom(0);
          console.log(reqArr);
          let i = 0;
          for (let ele of reqArr) {
            if (i > 3) break;
            dispTemparr.push(ele[0]);
            i++;
          }
          setDataDispNames(dispTemparr);
          console.log(dispTemparr);
          //   return dispTemparr;
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setDataDispNames(dataDispNames);
  }, [dataDispNames]);

  useEffect(() => {
    let summaryTemp = getCampaigns();
    fetchRecommendedCampaigns(summaryTemp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description]);

  useEffect(() => {
    let summaryTemp = getCampaigns();
    fetchRecommendedCampaigns(summaryTemp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description]);

  const getCampaigns = async () => {
    try {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      const summary = await Promise.all(
        campaigns.map((campaign, i) => Campaign(campaigns[i]).methods.getSummary().call())
      );
      setCampaignList(summary);
      const ethPrice = await getETHPrice();
      updateEthPrice(ethPrice);
      let i = 0;
      for (let ele of campaigns) {
        cName2Id[summary[i]["5"]] = ele;
        i++;
      }
      return summary;
    } catch (e) {
      console.log("ERROR in RecommendedCampaigns.");
      console.log(e);
    }
  };

  return (
    // <></>
    <Flex w={"100%"} flexDir={"column"}>
      <Flex mb={3}>
        <Heading fontSize={30} mr={10}>
          Similar Campaigns that you may like...
        </Heading>
      </Flex>
      {loadingRecom ? (
        <Center w={"100%"} p={"10vh"}>
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Center>
      ) : (
        <Flex minH={"100vh"} maxH={"100vh"} overflowY={"auto"}>
          <SimpleGrid row={{ base: 1, md: 3 }} spacing={10} py={8}>
            {dataDispNames.map((ele, i) => {
              for (var k = 0; k < campaignList.length; k++) {
                if (ele === campaignList[k][5]) {
                  let el = campaignList[k];
                  console.log("RANGE");
                  console.log(el[5]);
                  {
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
