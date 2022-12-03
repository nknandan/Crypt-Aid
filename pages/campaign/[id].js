import Head from "next/head";
import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useWindowSize } from "react-use";
import {
  getETHPrice,
  getETHPriceInUSD,
  getWEIPriceInUSD,
} from "../../lib/getETHPrice";
import {
  Box,
  Image,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
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
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";

import { InfoIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import Confetti from "react-confetti";

import web3 from "../../smart-contract/web3";
import Campaign from "../../smart-contract/campaign";
import factory from "../../smart-contract/factory";
import { redirect } from "next/dist/server/api-utils";
import { connectMongo } from "../../utils/connectMongo";
import User from "../../models/user";
import CampaignModel from "../../models/campaignModel";

export async function getServerSideProps({ params }) {
  const campaignId = params.id;
  const campaign = Campaign(campaignId);
  const summary = await campaign.methods.getSummary().call();
  const ETHPrice = await getETHPrice();
  await connectMongo();
  const users = await User.find();
  const dbCamp = await CampaignModel.find();

  // console.log(users);
  // console.log(dbCamp);

  return {
    props: {
      id: campaignId,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      name: summary[5],
      description: summary[6],
      image: summary[7],
      target: summary[8],
      ETHPrice,
      users: JSON.parse(JSON.stringify(users)),
      dbCamp: JSON.parse(JSON.stringify(dbCamp)),
    },
  };
}

function StatsCard(props) {
  const { title, stat, info } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"sm"}
      border={"2px solid"}
      borderColor={"#43B0F1"}
      rounded={"lg"}
      transition={"transform 0.3s ease"}
      _hover={{
        transform: "translateY(-5px)",
      }}
    >
      <Tooltip
        // label={info}
        bg={useColorModeValue("white", "gray.700")}
        placement={"top"}
        color={useColorModeValue("gray.800", "white")}
        fontSize={"1em"}
        borderRadius={"10px"}
      >
        <Flex justifyContent={"space-between"}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel fontWeight={"medium"}>{title}</StatLabel>
            <StatNumber
              fontSize={"base"}
              fontWeight={"bold"}
              maxW={{ base: "	10rem", sm: "sm" }}
            >
              {stat}
            </StatNumber>
          </Box>
        </Flex>
      </Tooltip>
    </Stat>
  );
}

export default function CampaignSingle({
  id,
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager,
  name,
  description,
  image,
  target,
  ETHPrice,
  users,
  dbCamp,
}) {
  const { handleSubmit, register, formState, reset, getValues } = useForm({
    mode: "onChange",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [amountInUSD, setAmountInUSD] = useState();
  const wallet = useWallet();
  const router = useRouter();
  const { width, height } = useWindowSize();
  async function onSubmit(data) {
    try {
      const u = localStorage.getItem("email");
      var tempUser = {};
      for (var k = 0; k < users.length; k++) {
        if (users[k].email == u) tempUser = users[k];
      }
      if (tempUser["donatedCampaigns"] == undefined)
        tempUser["donatedCampaigns"] = [name];
      else if (tempUser["donatedCampaigns"].includes(name) == false)
        tempUser["donatedCampaigns"].push(name);

      // console.log(parseFloat(getETHPriceInUSD(ETHPrice, amountInUSD)));
      if (tempUser["donatedAmount"] == undefined)
        tempUser["donatedAmount"] = parseFloat(
          getETHPriceInUSD(ETHPrice, amountInUSD)
        );
      else
        tempUser["donatedAmount"] =
          parseFloat(tempUser["donatedAmount"]) +
          parseFloat(getETHPriceInUSD(ETHPrice, amountInUSD));
      try {
        fetch("/api/user2", {
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

      const campaign = Campaign(id);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contibute().send({
        from: accounts[0],
        value: web3.utils.toWei(data.value, "ether"),
      });

      // console.log(u);
      var tempObj = {};
      for (var i = 0; i < dbCamp.length; i++) {
        if (dbCamp[i].name == name) tempObj = dbCamp[i];
      }
      if (tempObj["donatorEmail"].includes(u) == false)
        tempObj["donatorEmail"].push(u);
      try {
        fetch("/api/campaign/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tempObj }),
        });
      } catch (err) {
        setError(err.message);
        console.log(err);
      }
      router.push(`/campaign/${id}`);
      setAmountInUSD(null);
      reset("", {
        keepValues: false,
      });
      setIsSubmitted(true);
      setError(false);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  return (
    <div>
      <Head>
        <title>Campaign Details</title>
        <meta name="description" content="Create a Withdrawal Request" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      {isSubmitted ? <Confetti width={width} height={height} /> : null}
      <main>
        {" "}
        {/* <Box position={"relative"}>
          
          <Container
            as={SimpleGrid}
            maxW={"7xl"}
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 10, lg: 32 }}
            py={{ base: 6 }}
          >
            <Stack spacing={{ base: 6 }}>
              <Image
                src={image}
                borderRadius={"20px"}
                boxShadow={"lg"}
              />
              <Box>
                <Stat
                  bg={useColorModeValue("white", "gray.700")}
                  boxShadow={"lg"}
                  rounded={"xl"}
                  p={{ base: 4, sm: 6, md: 8 }}
                  spacing={{ base: 8 }}
                >
                  <StatLabel fontWeight={"medium"}>
                    <Text as="span"  mr={2}>
                      {" "}
                      Campaign Balance
                    </Text>
                    <Tooltip
                      label="The balance is how much money this campaign has left to
                  spend."
                      bg={useColorModeValue("white", "gray.700")}
                      placement={"top"}
                      color={useColorModeValue("gray.800", "white")}
                      fontSize={"1em"}
                      px="4"
                    >
                      <InfoIcon
                        color={useColorModeValue("teal.800", "white")}
                      />
                    </Tooltip>
                  </StatLabel>
                  <StatNumber>
                    <Box
                      fontSize={"2xl"}
                      
                      maxW={{ base: "	15rem", sm: "sm" }}
                      pt="2"
                    >
                      <Text as="span" fontWeight={"bold"}>
                        {balance > 0
                          ? web3.utils.fromWei(balance, "ether")
                          : "0, Become a Donor 😄"}
                      </Text>
                      <Text
                        as="span"
                        display={balance > 0 ? "inline" : "none"}
                        pr={2}
                        fontWeight={"bold"}
                      >
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
                        (${getWEIPriceInUSD(ETHPrice, balance)})
                      </Text>
                    </Box>
                    <Text fontSize={"md"} fontWeight="normal">
                      target of {web3.utils.fromWei(target, "ether")} ETH ($
                      {getWEIPriceInUSD(ETHPrice, target)})
                    </Text>
                    <Progress
                      colorScheme="teal"
                      size="sm"
                      value={web3.utils.fromWei(balance, "ether")}
                      max={web3.utils.fromWei(target, "ether")}
                      mt={4}
                    />
                  </StatNumber>
                </Stat>
              </Box>
              <Box mx={"auto"} w={"full"}>
                <SimpleGrid columns={{ base: 1 }} spacing={{ base: 5 }}>
                  <StatsCard
                    title={"Minimum Contribution"}
                    stat={`${web3.utils.fromWei(
                      minimumContribution,
                      "ether"
                    )} ETH ($${getWEIPriceInUSD(
                      ETHPrice,
                      minimumContribution
                    )})`}
                    info={
                      "You must contribute at least this much in Wei ( 1 ETH = 10 ^ 18 Wei) to become an approver"
                    }
                  />
                  <StatsCard
                    title={"Wallet Address of Campaign Creator"}
                    stat={manager}
                    info={
                      "The Campaign Creator created the campaign and can create requests to withdraw money."
                    }
                  />
                  <StatsCard
                    title={"Number of Requests"}
                    stat={requestsCount}
                    info={
                      "A request tries to withdraw money from the contract. Requests must be approved by approvers"
                    }
                  />
                  <StatsCard
                    title={"Number of Approvers"}
                    stat={approversCount}
                    info={
                      "Number of people who have already donated to this campaign"
                    }
                  />
                </SimpleGrid>
              </Box>
            </Stack>
            <Stack spacing={{ base: 4 }}>
              <Stack
                bg={useColorModeValue("white", "gray.700")}
                boxShadow={"lg"}
                rounded={"xl"}
                p={{ base: 4, sm: 6, md: 8 }}
                spacing={{ base: 6 }}
              >
                <Heading
                  lineHeight={1.1}
                  fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                >
                  {name}
                </Heading>
                <Text
                  color={useColorModeValue("gray.500", "gray.200")}
                  fontSize={{ base: "lg" }}
                >
                  {description}
                </Text>
                <Link
                  color="#0065A1"
                  href={`https://rinkeby.etherscan.io/address/${id}`}
                  isExternal
                >
                  View on Rinkeby Etherscan <ExternalLinkIcon mx="2px" />
                </Link>
                <Heading
                  lineHeight={1.1}
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  color={useColorModeValue("teal.600", "teal.200")}
                >
                  Contribute Now!
                </Heading>
                <Box mt={10}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl id="value">
                      <FormLabel>
                        Amount in Ether you want to contribute
                      </FormLabel>
                      <InputGroup>
                        {" "}
                        <Input
                          {...register("value", { required: true })}
                          type="number"
                          isDisabled={formState.isSubmitting}
                          onChange={(e) => {
                            setAmountInUSD(Math.abs(e.target.value));
                          }}
                          step="any"
                          min="0"
                        />{" "}
                        <InputRightAddon children="ETH" />
                      </InputGroup>
                      {amountInUSD ? (
                        <FormHelperText>
                          ~$ {getETHPriceInUSD(ETHPrice, amountInUSD)}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                    {error ? (
                      <Alert status="error" mt="2">
                        <AlertIcon color={"red"} />
                        <AlertDescription mr={2}> {error}</AlertDescription>
                      </Alert>
                    ) : null}
                    <Stack spacing={10}>
                      {wallet.status === "connected" ? (
                        <Button
                          // fontFamily={"heading"}
                          mt={4}
                          w={"full"}
                          bgGradient="linear(to-r, teal.400,green.400)"
                          color={"white"}
                          _hover={{
                            bgGradient: "linear(to-r, teal.400,blue.400)",
                            boxShadow: "xl",
                          }}
                          isLoading={formState.isSubmitting}
                          isDisabled={amountInUSD ? false : true}
                          type="submit"
                        >
                          Contribute
                        </Button>
                      ) : (
                        <Alert status="warning" mt={4} bgColor={"red.100"}>
                          <AlertIcon color={"red"} />
                          <AlertDescription mr={2}>
                            Please Connect Your Wallet to Contribute
                          </AlertDescription>
                        </Alert>
                      )}
                    </Stack>
                  </form>
                </Box>
              </Stack>
              <Stack
                bg={useColorModeValue("white", "gray.700")}
                boxShadow={"lg"}
                rounded={"xl"}
                p={{ base: 4, sm: 6, md: 8 }}
                spacing={4}
              >
                <NextLink href={`/campaign/${id}/requests`}>
                  <Button
                    // fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, teal.400,green.400)"
                    color={"white"}
                    _hover={{
                      bgGradient: "linear(to-r, teal.400,blue.400)",
                      boxShadow: "xl",
                    }}
                  >
                    View Withdrawal Requests
                  </Button>
                </NextLink>
                <Text fontSize={"sm"}>
                  * You can see where these funds are being used & if you have
                  contributed you can also approve those Withdrawal Requests :)
                </Text>
              </Stack>
            </Stack>
          </Container>
        </Box> */}
        <Flex
          px={"17.5vw"}
          direction={"column"}
          justifyContent={"space-evenly"}
          gap={"3vw"}
          marginTop={"5vh"}
        >
          {isSubmitted ? (
            <Container
              maxW={"7xl"}
              columns={{ base: 1, md: 2 }}
              spacing={{ base: 10, lg: 32 }}
              py={{ base: 6 }}
            >
              <Alert status="success" mt="2">
                <AlertIcon />
                <AlertDescription mr={2}>
                  {" "}
                  Thank You for your Contribution 🙏
                </AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => setIsSubmitted(false)}
                />
              </Alert>
            </Container>
          ) : null}
          <Flex direction={"row"}>
            <Image
              src={image}
              alt={""}
              fit={"fill"}
              borderRadius={"20px"}
              maxW={"25vw"}
              maxH={"50vh"}
            />
            <Flex
              ml={"5vw"}
              justifyContent={"space-evenly"}
              direction={"column"}
            >
              <Heading
                lineHeight={1.1}
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              >
                {name}
              </Heading>
              <Text
                color={useColorModeValue("gray.500", "gray.200")}
                fontSize={{ base: "lg" }}
              >
                {description}
              </Text>
              <Link
                color="#0065A1"
                href={`https://goerli.etherscan.io/address/${id}`}
                isExternal
              >
                View on Goerli Etherscan <ExternalLinkIcon mx="2px" />
              </Link>
            </Flex>
          </Flex>
          <Box>
            <Stat
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              rounded={"20px"}
              p={{ base: 4, sm: 6, md: 8 }}
              spacing={{ base: 8 }}
            >
              <StatLabel fontWeight={"medium"}>
                <Text as="span" mr={2}>
                  {" "}
                  Campaign Balance
                </Text>
                <Tooltip
                  label="The balance is how much money this campaign has left to
                  spend."
                  bg={useColorModeValue("white", "gray.700")}
                  placement={"top"}
                  color={useColorModeValue("gray.800", "white")}
                  fontSize={"1em"}
                  px="4"
                >
                  <InfoIcon color={useColorModeValue("teal.800", "white")} />
                </Tooltip>
              </StatLabel>
              <StatNumber>
                <Box fontSize={"2xl"} maxW={{ base: "	15rem", sm: "sm" }} pt="2">
                  <Text as="span" fontWeight={"bold"}>
                    {balance > 0
                      ? web3.utils.fromWei(balance, "ether")
                      : "0, Become a Donor 😄"}
                  </Text>
                  <Text
                    as="span"
                    display={balance > 0 ? "inline" : "none"}
                    pr={2}
                    fontWeight={"bold"}
                  >
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
                    (${getWEIPriceInUSD(ETHPrice, balance)})
                  </Text>
                </Box>

                <Text fontSize={"md"} fontWeight="normal">
                  target of {web3.utils.fromWei(target, "ether")} ETH ($
                  {getWEIPriceInUSD(ETHPrice, target)})
                </Text>
                <Progress
                  colorScheme="teal"
                  size="sm"
                  value={web3.utils.fromWei(balance, "ether")}
                  max={web3.utils.fromWei(target, "ether")}
                  mt={4}
                />
              </StatNumber>
            </Stat>
          </Box>
          <Flex direction={"row"} justifyContent={"space-between"}>
            <Stack
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              rounded={"20px"}
              paddingY={"3vw"}
              paddingX={"2vw"}
              spacing={10}
              maxW={"48%"}
            >
              <>
                <NextLink href={`/campaign/${id}/requests`}>
                  <Button
                    // fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, teal.400,green.400)"
                    color={"white"}
                    _hover={{
                      bgGradient: "linear(to-r, teal.400,blue.400)",
                      boxShadow: "xl",
                    }}
                  >
                    View Withdrawal Requests
                  </Button>
                </NextLink>

                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Feature Under Maintainance
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        This feature is currently being developed and is not
                        ready for use.
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button colorScheme="red" onClick={onClose} ml={3}>
                          Close
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </>

              <Text fontSize={"sm"}>
                * You can see where these funds are being used & if you have
                contributed you can also approve those Withdrawal Requests :)
              </Text>
            </Stack>
            <Stack
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              rounded={"20px"}
              p={{ base: 4, sm: 6, md: 8 }}
              spacing={4}
              maxW={"48%"}
              width={"48%"}
            >
              <Heading
                lineHeight={1}
                fontSize={{ base: "2xl", sm: "3xl" }}
                color={useColorModeValue("teal.600", "teal.200")}
              >
                Contribute Now!
              </Heading>
              <Box mt={5}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl id="value">
                    <FormLabel>
                      Amount in Ether you want to contribute
                    </FormLabel>
                    <InputGroup>
                      {" "}
                      <Input
                        {...register("value", { required: true })}
                        type="number"
                        isDisabled={formState.isSubmitting}
                        onChange={(e) => {
                          setAmountInUSD(Math.abs(e.target.value));
                        }}
                        step="any"
                        min="0"
                      />{" "}
                      <InputRightAddon children="ETH" />
                    </InputGroup>
                    {amountInUSD ? (
                      <FormHelperText>
                        ~$ {getETHPriceInUSD(ETHPrice, amountInUSD)}
                      </FormHelperText>
                    ) : null}
                  </FormControl>

                  {error ? (
                    <Alert status="error" mt="2">
                      <AlertIcon color={"red"} />
                      <AlertDescription mr={2}> {error}</AlertDescription>
                    </Alert>
                  ) : null}

                  <Stack spacing={10}>
                    {wallet.status === "connected" ? (
                      <Button
                        // fontFamily={"heading"}
                        mt={4}
                        w={"full"}
                        bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
                        color={"white"}
                        _hover={{
                          bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
                          boxShadow: "xl",
                        }}
                        isLoading={formState.isSubmitting}
                        isDisabled={amountInUSD ? false : true}
                        type="submit"
                      >
                        Contribute
                      </Button>
                    ) : (
                      <Alert status="warning" mt={4} bgColor={"red.100"}>
                        <AlertIcon color={"red"} />
                        <AlertDescription mr={2}>
                          Please Connect Your Wallet to Contribute
                        </AlertDescription>
                      </Alert>
                    )}
                  </Stack>
                </form>
              </Box>
            </Stack>
          </Flex>
          <SimpleGrid columns={{ base: 2 }} spacing={{ base: 5 }}>
            <StatsCard
              title={"Minimum Contribution"}
              stat={`${web3.utils.fromWei(
                minimumContribution,
                "ether"
              )} ETH ($${getWEIPriceInUSD(ETHPrice, minimumContribution)})`}
              info={
                "You must contribute at least this much in Wei ( 1 ETH = 10 ^ 18 Wei) to become an approver"
              }
            />
            <StatsCard
              title={"Wallet Address of Campaign Creator"}
              stat={manager}
              info={
                "The Campaign Creator created the campaign and can create requests to withdraw money."
              }
            />
            <StatsCard
              title={"Number of Requests"}
              stat={requestsCount}
              info={
                "A request tries to withdraw money from the contract. Requests must be approved by approvers"
              }
            />
            <StatsCard
              title={"Number of Approvers"}
              stat={approversCount}
              info={
                "Number of people who have already donated to this campaign"
              }
            />
          </SimpleGrid>
        </Flex>
      </main>
    </div>
  );
}
