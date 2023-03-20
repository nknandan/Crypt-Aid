import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import OTPModal from "./OTPModal";
import {
  Heading,
  useBreakpointValue,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Container,
  SimpleGrid,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  InputRightAddon,
  InputGroup,
  Input,
  Divider,
  Skeleton,
  Image,
  Img,
  Icon,
  chakra,
  Tooltip,
  Link,
  SkeletonCircle,
  HStack,
  Stack,
  Progress,
  Center,
} from "@chakra-ui/react";

var OTP;

export default function Home({ campaigns }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Handle OTP verification logic here
  const handleVerify = async (otp) => {
    if (OTP == otp) {
      alert("OTP Verified");
    } else {
      alert("Incorrect OTP. Try again.");
    }
    setIsModalOpen(false);
  };

  const sendOTP = async () => {
    const res = await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    const apiResponse = await res.json();
    console.log(apiResponse);
    OTP = apiResponse.otp;
  };

  return (
    <div>
      <Head>
        <title>KYC | CryptAid</title>
        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} minH={"50vh"}>
          <HStack spacing={2} justifyContent={"space-between"}>
            <Heading as="h2" size="lg">
              KYC Verification
            </Heading>
          </HStack>
          <Divider marginTop="4" />
          <Flex mt={10} justifyContent={"space-between"} alignItems={"center"}>
            <Img height={"400px"} objectFit={"contain"} src={"/kyc.png"} borderRadius={20} />
            <Flex flexDir={"column"} w={"40%"}>
              <Box rounded={"2xl"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
                <Heading fontSize={"26px"} mb={4}>
                  Enter your details
                </Heading>
                <form>
                  <Stack spacing={4}>
                    <FormControl id="campaignName">
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        placeholder={"XXXX-XXXX-XX"}
                        type={"tel"}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </FormControl>
                    <Button
                      color={"white"}
                      bg={"#43B0F1"}
                      _hover={{
                        bg: "#0065A1",
                        color: "white",
                      }}
                      onClick={() => {
                        setIsModalOpen(true);
                        sendOTP();
                      }}
                    >
                      Send OTP
                    </Button>
                    <OTPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVerify={handleVerify} />
                  </Stack>
                </form>
              </Box>
            </Flex>
          </Flex>
        </Container>
      </main>
    </div>
  );
}
