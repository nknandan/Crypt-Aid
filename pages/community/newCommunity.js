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
    console.log(data);
    const o = JSON.parse(localStorage.getItem("user"));
    try {
      fetch("/api/communities/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.communityName,
          description: data.description,
          imageUrl: data.imageUrl,
          creator: o.name,
          moderators: [o.name],
          members: [],
          campaigns: [],
          posts: [],
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
          var tempUser = dbUsers.users[k];
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
        <title>CryptAid | Create Community</title>
        <meta name="description" content="Create New Community" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main>
        <Flex direction={"row"} justifyContent={"space-evenly"}>
          <Box>
            <Text fontSize={"lg"} color={"#1CB5E0"} mb={"13vh"}>
              <ArrowBackIcon mr={2} />
              <NextLink href="/"> Back to Home</NextLink>
            </Text>
            <Image src={"/communities2.png"} alt="" objectFit="cover" w="40vw" h="40vh" my={"auto"} />
          </Box>
          <Stack spacing={8} py={12} px={6} w={"40vw"}>
            <Stack>
              <Heading fontSize={"4xl"}>Create a community</Heading>
            </Stack>
            <Box rounded={"2xl"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                  <FormControl id="communityName">
                    <FormLabel>Name</FormLabel>
                    <Input
                      {...register("communityName", { required: true })}
                      isDisabled={isSubmitting}
                      placeholder={"FundBoosters"}
                    />
                  </FormControl>
                  <FormControl id="description">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      {...register("description", { required: true })}
                      isDisabled={isSubmitting}
                      placeholder={
                        "FundBoosters is a vibrant online community of entrepreneurs, investors, and supporters committed to bringing great ideas to life. Whether you're a startup looking for seed funding, a creative artist seeking backing for your latest project, or simply someone who loves to invest in new ventures, FundBoosters is the place for you. Here, you can connect with like-minded individuals, share your goals and ideas, and leverage the collective power of the community to get your project off the ground. Join FundBoosters today and start turning your dreams into reality!"
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
                  {/* <FormControl id="minimumContribution">
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
                  </FormControl> */}

                  {error ? (
                    <Alert status="error">
                      <AlertIcon color={"red"} />
                      <AlertDescription mr={2}> {error}</AlertDescription>
                    </Alert>
                  ) : null}
                  {errors.name ||
                  errors.description ||
                  errors.imageUrl ? (
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
                          <AlertDescription mr={2}>Connect your wallet to create communities</AlertDescription>
                        </Alert>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      </main>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
