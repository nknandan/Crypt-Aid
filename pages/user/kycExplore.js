import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import OTPModal from "../OTPModal";
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
  Spinner,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
  InputRightAddon,
  InputLeftElement,
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
import { PlusSquareIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { storage } from "../../firebase/clientApp";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { set } from "mongoose";
import { useRouter, withRouter } from "next/router";
import { connectMongo } from "../../utils/connectMongo";
import User from "../../models/user";

var OTP;
var userEmail;
var thisUser;

export async function getServerSideProps() {
  await connectMongo();
  const users = await User.find();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    },
  };
}

export default function Home({ users }) {
  const [verificationPhase, setverificationPhase] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [PAN, setPAN] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [address, setAddress] = useState(null);
  const [photograph, setPhotograph] = useState(null);
  const [sign, setSign] = useState(null);

  const [urlPAN, setUrlPAN] = useState(null);
  const [urlAadhar, setUrlAadhar] = useState(null);
  const [urlAddress, setUrlAddress] = useState(null);
  const [urlPhotograph, setUrlPhotograph] = useState(null);
  const [urlSign, setUrlSign] = useState(null);

  useEffect(() => {
    userEmail = localStorage.getItem("email");
    for (var i = 0; i < users.length; i++) {
      if (users[i].email == userEmail) thisUser = users[i];
    }
    if (thisUser["verificationComplete"] == true) setverificationPhase(4);
    else if (thisUser["pendingVerification"] == true) setverificationPhase(3);
    // handleNextPhase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePANChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].type == "application/pdf") setPAN(e.target.files[0]);
      else {
        alert("Upload PDF File Only.");
        return;
      }
    }
  };
  const handleAadharChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].type == "application/pdf") setAadhar(e.target.files[0]);
      else {
        alert("Upload PDF File Only.");
        return;
      }
    }
  };
  const handleAddressChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].type == "application/pdf") setAddress(e.target.files[0]);
      else {
        alert("Upload PDF File Only.");
        return;
      }
    }
  };
  const handlePhotographChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].type == "image/jpeg") setPhotograph(e.target.files[0]);
      else {
        alert("Upload JPEG File Only.");
        return;
      }
    }
  };

  const handleSignChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].type == "image/jpeg") setSign(e.target.files[0]);
      else {
        alert("Upload JPEG File Only.");
        return;
      }
    }
  };

  const handlePANSubmit = (event) => {
    event.preventDefault();
    const PANRef = storageRef(storage, userEmail + "/pan.pdf");
    console.log(PANRef);
    uploadBytes(PANRef, PAN)
      .then(() => {
        getDownloadURL(PANRef)
          .then((url) => {
            setUrlPAN(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
        setPAN(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const handleAadharSubmit = (event) => {
    event.preventDefault();
    const AadharRef = storageRef(storage, userEmail + "/aadhar.pdf");
    console.log(AadharRef);
    uploadBytes(AadharRef, aadhar)
      .then(() => {
        getDownloadURL(AadharRef)
          .then((url) => {
            setUrlAadhar(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
        setAadhar(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const handleAddressSubmit = (event) => {
    event.preventDefault();
    const AddressRef = storageRef(storage, userEmail + "/address.pdf");
    console.log(AddressRef);
    uploadBytes(AddressRef, address)
      .then(() => {
        getDownloadURL(AddressRef)
          .then((url) => {
            setUrlAddress(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
        setAddress(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const handlePhotographSubmit = (event) => {
    event.preventDefault();
    const PhotographRef = storageRef(storage, userEmail + "/photograph.jpg");
    console.log(PhotographRef);
    uploadBytes(PhotographRef, photograph)
      .then(() => {
        getDownloadURL(PhotographRef)
          .then((url) => {
            setUrlPhotograph(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
        setPhotograph(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const handleSignSubmit = (event) => {
    event.preventDefault();
    const SignRef = storageRef(storage, userEmail + "/sign.jpg");
    console.log(SignRef);
    uploadBytes(SignRef, sign)
      .then(() => {
        getDownloadURL(SignRef)
          .then((url) => {
            setUrlSign(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
        setSign(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleNextPhase = () => {
    if (thisUser["pendingVerification"] == undefined) thisUser["pendingVerification"] = true;
    else thisUser["pendingVerification"] = true;
    if (thisUser["verificationComplete"] == undefined) thisUser["verificationComplete"] = false;
    else thisUser["verificationComplete"] = false;
    try {
      fetch("/api/user3", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thisUser }),
      });
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
    setverificationPhase(verificationPhase + 1);
  };
  function debug() {
    console.log(PAN);
    console.log(typeof userEmail);
    console.log(storage);
    console.log(urlPAN);
  }

  // Handle OTP verification logic here
  const handleVerifyOTP = async (otp) => {
    if (OTP == otp) {
      alert("OTP Verified");
      setIsModalOpen(false);
      handleNextPhase();
      if (thisUser["phoneNumber"] == undefined) thisUser["phoneNumber"] = phoneNumber;
      else thisUser["phoneNumber"] = phoneNumber;
      console.log(thisUser);
      try {
        fetch("/api/user3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ thisUser }),
        });
      } catch (err) {
        setError(err.message);
        console.log(err);
      }
      // Add this verified phoneNumber to the currently logged In User's Database.
      // "phoneNumber" in user's database.
    } else {
      alert("Incorrect OTP. Try again.");
    }
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
    // res.status(201).json({ message: "SUCCESS" });
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // validate file type
    if (!file.type.startsWith("image/")) {
      setFileError("Only image files are allowed.");
      return;
    }

    setSelectedFile(file);
    setFileError(null);
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
          <Box p="6" shadow="lg" rounded="lg" bg="white">
            <Flex justify="space-between">
              <Text fontWeight="semibold" fontSize={"26px"}>
                Verification Progress
              </Text>
              <div>
                <Button
                  onClick={() => {
                    debug();
                  }}
                >
                  DEBUG
                </Button>
                <Button
                  onClick={() => {
                    setverificationPhase(2);
                  }}
                >
                  NEXT
                </Button>
              </div>
              <Text color="gray.500" fontSize="sm">
                Step {verificationPhase} of 4
              </Text>
            </Flex>
            <Progress value={verificationPhase * 25} my="6" hasStripe colorScheme="green" />

            {/* <Stack spacing="6">
              <Box>
                <Text fontWeight="semibold" mb="2">
                  Step 1: Upload Contact Information
                </Text>
                {verificationPhase >= 1 ? (
                  <Text color="gray.500">Contact information uploaded.</Text>
                ) : (
                  <Button onClick={handleNextPhase}>Upload Contact Info</Button>
                )}
              </Box>
              <Box>
                <Text fontWeight="semibold" mb="2">
                  Step 2: Upload Personal Documents
                </Text>
                {verificationPhase >= 2 ? (
                  <Text color="gray.500">Personal documents uploaded.</Text>
                ) : (
                  <Button onClick={handleNextPhase}>Upload Personal Docs</Button>
                )}
              </Box>
              <Box>
                <Text fontWeight="semibold" mb="2">
                  Step 3: Wait for Verification
                </Text>
                {verificationPhase >= 3 ? (
                  <Text color="gray.500">Verification in progress.</Text>
                ) : (
                  <Button onClick={handleNextPhase}>Wait for Verification</Button>
                )}
              </Box>
              <Box>
                <Text fontWeight="semibold" mb="2">
                  Step 4: Success
                </Text>
                {verificationPhase >= 4 ? (
                  <Text color="gray.500">Verification successful.</Text>
                ) : (
                  <Button onClick={handleNextPhase}>Verification Success</Button>
                )}
              </Box>
            </Stack> */}
          </Box>

          {verificationPhase == 1 ? (
            <Flex mt={10} justifyContent={"space-between"} alignItems={"center"}>
              <Img height={"400px"} objectFit={"contain"} src={"/kyc.png"} borderRadius={20} />
              <Flex flexDir={"column"} w={"40%"}>
                {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
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
                          name="phoneNumber"
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
                        disabled={!phoneNumber}
                        onClick={() => {
                          setIsModalOpen(true);
                          sendOTP();
                        }}
                      >
                        Send OTP
                      </Button>
                      <OTPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVerify={handleVerifyOTP} />
                    </Stack>
                  </form>
                </Box>
              </Flex>
            </Flex>
          ) : (
            <></>
          )}

          {verificationPhase == 2 ? (
            <Flex mt={10} justifyContent={"space-between"} alignItems={"center"}>
              <Img height={"400px"} objectFit={"contain"} src={"/kyc.png"} borderRadius={20} />
              <Flex flexDir={"column"} w={"40%"}>
                {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                <Box rounded={"2xl"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
                  <Heading fontSize={"26px"} mb={4}>
                    Upload your documents
                  </Heading>
                  <form>
                    <Stack spacing={4}>
                      <Box as="form">
                        <FormControl as="fieldset">
                          <FormLabel htmlFor="file" fontWeight={"semibold"}>
                            Upload PAN Card
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <PlusSquareIcon color="black" />
                            </InputLeftElement>
                            <Input
                              variant="filled"
                              type="file"
                              onChange={handlePANChange}
                              id="file"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              _hover={{
                                cursor: "pointer",
                              }}
                              backgroundColor="blue.100"
                              py="1.5"
                              w={"100%"}
                            />
                            <FormErrorMessage>{}</FormErrorMessage>
                          </InputGroup>
                          <FormLabel htmlFor="file" mt={5} fontWeight={"semibold"}>
                            Upload Aadhar Card
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <PlusSquareIcon color="black" />
                            </InputLeftElement>
                            <Input
                              variant="filled"
                              type="file"
                              onChange={handleAadharChange}
                              id="file"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              _hover={{
                                cursor: "pointer",
                              }}
                              backgroundColor="blue.100"
                              py="1.5"
                              w={"100%"}
                            />
                            <FormErrorMessage>{}</FormErrorMessage>
                          </InputGroup>
                          <FormLabel htmlFor="file" mt={5} fontWeight={"semibold"}>
                            Permanent Address Proof
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <PlusSquareIcon color="black" />
                            </InputLeftElement>
                            <Input
                              variant="filled"
                              type="file"
                              onChange={handleAddressChange}
                              id="file"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              _hover={{
                                cursor: "pointer",
                              }}
                              backgroundColor="blue.100"
                              py="1.5"
                              w={"100%"}
                            />
                            <FormErrorMessage>{}</FormErrorMessage>
                          </InputGroup>
                          <FormLabel htmlFor="file" mt={5} fontWeight={"semibold"}>
                            Upload Your Photograph
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <PlusSquareIcon color="black" />
                            </InputLeftElement>
                            <Input
                              variant="filled"
                              type="file"
                              onChange={handlePhotographChange}
                              id="file"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              _hover={{
                                cursor: "pointer",
                              }}
                              backgroundColor="blue.100"
                              py="1.5"
                              w={"100%"}
                            />
                            <FormErrorMessage>{}</FormErrorMessage>
                          </InputGroup>
                          <FormLabel htmlFor="file" mt={5} fontWeight={"semibold"}>
                            Upload Your Signature
                          </FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <PlusSquareIcon color="black" />
                            </InputLeftElement>
                            <Input
                              variant="filled"
                              type="file"
                              onChange={handleSignChange}
                              id="file"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              _hover={{
                                cursor: "pointer",
                              }}
                              backgroundColor="blue.100"
                              py="1.5"
                              w={"100%"}
                            />
                            <FormErrorMessage>{}</FormErrorMessage>
                          </InputGroup>
                        </FormControl>
                      </Box>

                      <Button
                        type="submit"
                        disabled={!PAN || !aadhar || !address || !photograph || !sign}
                        color={"white"}
                        bg={"#43B0F1"}
                        _hover={{
                          bg: "#0065A1",
                          color: "white",
                        }}
                        onClick={(e) => {
                          handlePANSubmit(e);
                          handleAadharSubmit(e);
                          handleAddressSubmit(e);
                          handlePhotographSubmit(e);
                          handleSignSubmit(e);
                          handleNextPhase();
                        }}
                      >
                        Upload
                      </Button>
                      <OTPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVerify={handleVerifyOTP} />
                    </Stack>
                  </form>
                </Box>
              </Flex>
            </Flex>
          ) : (
            <></>
          )}

          {verificationPhase == 3 ? (
            <Flex mt={10} justifyContent={"space-between"} alignItems={"center"}>
              <Img height={"400px"} objectFit={"contain"} src={"/kyc.png"} borderRadius={20} />
              <Flex flexDir={"column"} w={"40%"}>
                <Box maxW="md" borderWidth="2px" borderRadius="lg" overflow="hidden" padding={"10"}>
                  <Center p={6}>
                    <Spinner size="xl" />
                  </Center>
                  <Box p={6}>
                    <Center mb={4}>
                      <Text fontSize="xl" fontWeight="bold">
                        Waiting for verification
                      </Text>
                    </Center>
                    <Center mb={4}>
                      <CheckCircleIcon color="green.500" mr={2} />
                      <Text>Uploaded Contact Information</Text>
                    </Center>
                    <Center mb={4}>
                      <CheckCircleIcon color="green.500" mr={2} />
                      <Text>Uploaded Personal Documents</Text>
                    </Center>
                  </Box>
                </Box>
              </Flex>
            </Flex>
          ) : (
            <></>
          )}

          {verificationPhase == 4 ? (
            <Flex mt={10} justifyContent={"space-between"} alignItems={"center"}>
              <Img height={"400px"} objectFit={"contain"} src={"/kyc.png"} borderRadius={20} />
              <Flex flexDir={"column"} w={"40%"}>
                <Box maxW="md" borderWidth="2px" borderRadius="lg" overflow="hidden" padding={10}>
                  <Center p={6}>
                    <CheckCircleIcon color="green.500" boxSize="6em" />
                  </Center>
                  <Box p={6}>
                    <Center mb={4}>
                      <Text fontSize="xl" fontWeight="bold" color={"green"}>
                        KYC Verification Success
                      </Text>
                    </Center>
                    <Center mb={4}>
                      <Text>Your identity has been successfully verified.</Text>
                    </Center>
                    <Center mb={4}>
                      <Text textAlign={"center"}>You can now access all the features of our platform.</Text>
                    </Center>
                    <Center mb={4} fontWeight={"600"} color={"blue.400"}>
                      <Text>Thank you for choosing our service!</Text>
                    </Center>
                  </Box>
                </Box>
              </Flex>
            </Flex>
          ) : (
            <></>
          )}
        </Container>
      </main>
    </div>
  );
}
