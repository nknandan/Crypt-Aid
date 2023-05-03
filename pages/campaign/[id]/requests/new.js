import Head from "next/head";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useWallet } from "use-wallet";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { getETHPrice, getETHPriceInUSD } from "../../../../lib/getETHPrice";
import {
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
  FormErrorMessage,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import web3 from "../../../../smart-contract/web3";
import Campaign from "../../../../smart-contract/campaign";
import { useAsync } from "react-use";
import { withPageAuthRequired, WithPageAuthRequired } from "@auth0/nextjs-auth0";

export default function NewRequest() {
  const router = useRouter();
  const { id } = router.query;
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
  });
  const [error, setError] = useState("");
  const [inUSD, setInUSD] = useState();
  const [userAccount, setUserAccount] = useState("");
  const [creatorAccount, setCreatorAccount] = useState("");
  const [ETHPrice, setETHPrice] = useState(0);
  const wallet = useWallet();
  useAsync(async () => {
    try {
      const result = await getETHPrice();
      const userAccountArray = await web3.eth.getAccounts();
      setUserAccount(userAccountArray[0]);
      setETHPrice(result);
      const campaign = Campaign(id);
      const summary = await campaign.methods.getSummary().call();
      setCreatorAccount(summary[4]);
    } catch (error) {
      console.log(error);
    }
  }, []);
  async function onSubmit(data) {
    const campaign = Campaign(id);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(data.description, web3.utils.toWei(data.value, "ether"), data.recipient)
        .send({ from: accounts[0] });

      router.push(`/campaign/${id}/requests`);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  const color1 = useColorModeValue("white", "gray.700");

  return (
    <div>
      <Head>
        <title>Create a Withdrawal Request</title>
        <meta name="description" content="Create a Withdrawal Request" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main>
        {/* <Button
          onClick={() => {
            console.log(userAccount, creatorAccount);
          }}
        >
          MEEEEH
        </Button> */}
        {creatorAccount == userAccount ? (
          <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
            <Text fontSize={"lg"} color={"teal.400"} justifyContent="center">
              <ArrowBackIcon mr={2} />
              <NextLink href={`/campaign/${id}/requests`}>Back to Requests</NextLink>
            </Text>
            <Stack>
              <Heading fontSize={"4xl"}>Create a Withdrawal Request 💸</Heading>
            </Stack>
            <Box rounded={"lg"} bg={color1} boxShadow={"lg"} p={8}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                  <FormControl id="description">
                    <FormLabel>Request Description</FormLabel>
                    <Textarea {...register("description", { required: true })} isDisabled={isSubmitting} />
                  </FormControl>
                  <FormControl id="value">
                    <FormLabel>Amount in Ether</FormLabel>
                    <InputGroup>
                      {" "}
                      <Input
                        type="number"
                        {...register("value", { required: true })}
                        isDisabled={isSubmitting}
                        onChange={(e) => {
                          setInUSD(Math.abs(e.target.value));
                        }}
                        step="any"
                      />{" "}
                      <InputRightAddon>
                        <span>ETH</span>
                      </InputRightAddon>
                    </InputGroup>
                    {inUSD ? <FormHelperText>~$ {getETHPriceInUSD(ETHPrice, inUSD)}</FormHelperText> : null}
                  </FormControl>

                  <FormControl id="recipient">
                    <FormLabel htmlFor="recipient">Recipient Ethereum Wallet Address</FormLabel>
                    <Input
                      name="recipient"
                      {...register("recipient", {
                        required: true,
                      })}
                      isDisabled={isSubmitting}
                    />
                  </FormControl>
                  {errors.description || errors.value || errors.recipient ? (
                    <Alert status="error">
                      <AlertIcon color={"red"} />
                      <AlertDescription mr={2}> All Fields are Required</AlertDescription>
                    </Alert>
                  ) : null}
                  {error ? (
                    <Alert status="error">
                      <AlertIcon color={"red"} />
                      <AlertDescription mr={2}> {error}</AlertDescription>
                    </Alert>
                  ) : null}
                  <Stack spacing={10}>
                    {wallet.status === "connected" ? (
                      <Button
                        bg={"teal.400"}
                        color={"white"}
                        _hover={{
                          bg: "teal.500",
                        }}
                        isLoading={isSubmitting}
                        type="submit"
                      >
                        Create Withdrawal Request
                      </Button>
                    ) : (
                      <Stack spacing={3}>
                        <Button
                          color={"white"}
                          bg={"teal.400"}
                          _hover={{
                            bg: "teal.300",
                          }}
                          onClick={() => wallet.connect()}
                        >
                          Connect Wallet{" "}
                        </Button>
                        <Alert status="warning">
                          <AlertIcon color={"red"} />
                          <AlertDescription mr={2}>Connect your wallet to create campaign</AlertDescription>
                        </Alert>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6} height={"70vh"}>
            <Text fontSize={"lg"} color={"teal.400"} justifyContent="center" marginBottom={"15vh"}>
              <ArrowBackIcon mr={2} />
              <NextLink href={`/campaign/${id}/requests`}>Back to Requests</NextLink>
            </Text>
            <Stack alignContent={"center"} bg={"red.200"} p={10} borderRadius={20}>
              <Heading fontSize={"4xl"} textAlign={"center"}>
                You must be the campaign creator to create withdrawal requests !
              </Heading>
            </Stack>
          </Stack>
        )}
      </main>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
