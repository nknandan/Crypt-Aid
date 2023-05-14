import React, { useState } from "react";
import Head from "next/head";
import { useAsync } from "react-use";
import { useRouter } from "next/router";
import { useWallet } from "use-wallet";
import { useForm } from "react-hook-form";
import {
  Image,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputRightAddon,
  InputGroup,
  Alert,
  AlertIcon,
  AlertDescription,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getETHPrice, getETHPriceInUSD } from "../../lib/getETHPrice";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import factory from "../../smart-contract/factory";
import web3 from "../../smart-contract/web3";
import axios from "axios";
import Understand from "twilio/lib/rest/preview/Understand";

var tempUser = {};

export default function NewCampaign() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const wallet = useWallet();
  const [minContriInUSD, setMinContriInUSD] = useState();
  const [targetInUSD, setTargetInUSD] = useState();
  const [ETHPrice, setETHPrice] = useState(0);
  useAsync(async () => {
    try {
      const result = await getETHPrice();
      setETHPrice(result);
    } catch (error) {
      console.log(error);
    }
  }, []);
  async function onSubmit(data) {
    const accounts = await web3.eth.getAccounts();
    await factory.methods
      .createCampaign(
        web3.utils.toWei(data.minimumContribution, "ether"),
        data.campaignName,
        data.description,
        data.imageUrl,
        web3.utils.toWei(data.target, "ether")
      )
      .send({
        from: accounts[0],
      });
    console.log(data);
    const o = JSON.parse(localStorage.getItem("user"));
    try {
      fetch("/api/campaign/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.campaignName,
          description: data.description,
          imageUrl: data.imageUrl,
          minAmount: web3.utils.toWei(data.minimumContribution, "ether"),
          targetAmount: web3.utils.toWei(data.target, "ether"),
          creatorEmail: o.email,
          isApproved: false,
          isActive: false,
          donatorEmail: [],
          upVoters: [],
          downVoters: [],
          comments: [],
          donations: [],
          raisedAmount: 0.0,
          withdrawnAmount: 0.0,
        }),
      });

      let res = await fetch("/api/user2", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let dbUsers = await res.json();

      for (var k = 0; k < dbUsers.users.length; k++) {
        if (dbUsers.users[k].email == o.email) {
          tempUser = dbUsers.users[k];
        }
      }
      if (tempUser["createdCampaigns"] == undefined) tempUser["createdCampaigns"] = [data.campaignName];
      else tempUser["createdCampaigns"].push(data.campaignName);

      console.log(tempUser);

      try {
        fetch("/api/user2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tempUser }),
        });
      } catch (err) {
        setError(err.message);
        console.log(err);
      }

      router.push("/");
      console.log("ADD 2");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  return (
    <div>
      <Head>
        <title>CryptAid | Create Campaign</title>
        <meta name="description" content="Create New Campaign" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main>
        <Flex direction={"row"} justifyContent={"space-evenly"}>
          {(tempUser["verificationComplete"] == undefined || tempUser["verificationComplete"] == false) ? (
            <Flex direction={"row"} justifyContent={"space-evenly"}>
              <Box>
                <Text fontSize={"lg"} color={"#1CB5E0"} mb={"13vh"}>
                  <ArrowBackIcon mr={2} />
                  <NextLink href="/"> Back to Home</NextLink>
                </Text>
                <Image src={"/new2.png"} alt="" objectFit="contain" w="30vw" h="60vh" my={"auto"} />
              </Box>
              <Flex spacing={8} py={12} px={6} w={"40vw"} flexDir={"column"} justifyContent={"center"}>
                <Flex>
                  <Heading fontSize={"4xl"}>Complete your KYC Verification first</Heading>
                </Flex>
                <Box rounded={"2xl"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8} mt={10}>
                  <Text>Head over to
                    <Link href="/user/kycExplore/" isExternal ml={"0.5rem"} color={"blue.700"}>
                      KYC Verification
                    </Link>{" "} to get started</Text>
                </Box>
              </Flex>
            </Flex>
          ) : (
            <Flex direction={"row"} justifyContent={"space-evenly"}>
              <Box>
                <Text fontSize={"lg"} color={"#1CB5E0"} mb={"13vh"}>
                  <ArrowBackIcon mr={2} />
                  <NextLink href="/"> Back to Home</NextLink>
                </Text>
                <Image src={"/new2.png"} alt="" objectFit="contain" w="30vw" h="60vh" my={"auto"} />
              </Box>
              <Stack spacing={8} py={12} px={6} w={"40vw"}>
                <Stack>
                  <Heading fontSize={"4xl"}>Create a campaign</Heading>
                </Stack>
                <Box rounded={"2xl"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>
                      <FormControl id="campaignName">
                        <FormLabel>Name</FormLabel>
                        <Input
                          {...register("campaignName", { required: true })}
                          isDisabled={isSubmitting}
                          placeholder={"Covid Relief Fund"}
                        />
                      </FormControl>
                      <FormControl id="description">
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          {...register("description", { required: true })}
                          isDisabled={isSubmitting}
                          placeholder={
                            "The COVID-19 pandemic is one of the worst health and economic crises in modern history and it continues to require the best of humanity to overcome. Your donation to this fund will help stop the spread of the virus, including the highly contagious Omicron variant, to protect us all."
                          }
                        />
                      </FormControl>
                      <FormControl id="imageUrl">
                        <FormLabel>Image URL</FormLabel>
                        <Input
                          {...register("imageUrl", { required: true })}
                          isDisabled={isSubmitting}
                          type="url"
                          placeholder={"https://via.placeholder.com/150"}
                        />
                      </FormControl>
                      <FormControl id="minimumContribution">
                        <FormLabel>Minimum Contribution Amount</FormLabel>
                        <InputGroup>
                          {" "}
                          <Input
                            type="number"
                            step="any"
                            {...register("minimumContribution", { required: true })}
                            isDisabled={isSubmitting}
                            onChange={(e) => {
                              setMinContriInUSD(Math.abs(e.target.value));
                            }}
                            placeholder={"0.000001"}
                          />{" "}
                          <InputRightAddon bgColor={"#9ed1f0"}>
                            <span>ETH</span>
                          </InputRightAddon>
                        </InputGroup>
                        {minContriInUSD ? (
                          <FormHelperText>~$ {getETHPriceInUSD(ETHPrice, minContriInUSD)}</FormHelperText>
                        ) : null}
                      </FormControl>
                      <FormControl id="target">
                        <FormLabel>Target Amount</FormLabel>
                        <InputGroup>
                          <Input
                            type="number"
                            step="any"
                            {...register("target", { required: true })}
                            isDisabled={isSubmitting}
                            onChange={(e) => {
                              setTargetInUSD(Math.abs(e.target.value));
                            }}
                            placeholder={"0.5"}
                          />
                          <InputRightAddon bgColor={"#9ed1f0"}>
                            <span>ETH</span>
                          </InputRightAddon>
                        </InputGroup>
                        {targetInUSD ? <FormHelperText>~$ {getETHPriceInUSD(ETHPrice, targetInUSD)}</FormHelperText> : null}
                      </FormControl>

                      {error ? (
                        <Alert status="error">
                          <AlertIcon color={"red"} />
                          <AlertDescription mr={2}> {error}</AlertDescription>
                        </Alert>
                      ) : null}
                      {errors.minimumContribution ||
                        errors.name ||
                        errors.description ||
                        errors.imageUrl ||
                        errors.target ? (
                        <Alert status="error">
                          <AlertIcon color={"red"} />
                          <AlertDescription mr={2}> All Fields are Required</AlertDescription>
                        </Alert>
                      ) : null}
                      <Stack spacing={10}>
                        {wallet.status === "connected" ? (
                          <Button
                            bg={"#43B0F1"}
                            color={"white"}
                            _hover={{
                              bg: "#0065A1",
                              color: "white",
                            }}
                            isLoading={isSubmitting}
                            type="submit"
                          >
                            Create
                          </Button>
                        ) : (
                          <Stack spacing={3}>
                            <Button
                              color={"white"}
                              bg={"#43B0F1"}
                              _hover={{
                                bg: "#0065A1",
                                color: "white",
                              }}
                              onClick={() => {
                                wallet.connect();
                              }}
                            >
                              Connect your wallet{" "}
                            </Button>
                            <Alert status="warning" bgColor={"red.100"}>
                              <AlertIcon color={"red"} />
                              <AlertDescription mr={2}>Connect your wallet to create campaigns</AlertDescription>
                            </Alert>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </form>
                </Box>
              </Stack>
            </Flex>
          )}
        </Flex>
      </main>
    </div >
  );
}

export const getServerSideProps = withPageAuthRequired();
