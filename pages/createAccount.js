import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { useForm } from "react-hook-form";
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

import factory from "../smart-contract/factory";

export async function getServerSideProps(context) {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log(campaigns);

    return {
        props: { campaigns },
    };
}

export default function Home({ campaigns }) {
    const [campaignList, setCampaignList] = useState([]);
    const [loginPage, setLoginPage] = useState(1);

    return (
        <div>
            <Head>
                <title>Login | CryptAid</title>
                <meta name="description" content="Transparent Crowdfunding in Blockchain" />
                <link rel="icon" href="/logo.svg" />
            </Head>
            <main className={styles.main}>
                <Box height={"100vh"} width={"100vw"} marginTop={"-8vh"} display={"flex"} >
                    <Center height={"100vh"} width={"50vw"} bgGradient='linear(to-l, #2471ae, #1CB5E0)' justifyContent={"center"} overflow={"hidden"}>
                        {/* <Image src={"/asdas.jpg"} width={"100%"} height={"100%"} mt={"10vh"} /> */}
                    </Center>
                    {
                        loginPage ? (<Box height={"100vh"} width={"50vw"} bg={"gray.100"} display={"flex"} alignItems={"center"} justifyContent={"center"} borderLeft={"1px"} borderColor={"gray"}>
                            <Flex height={"60vh"} width={"30vw"} flexDirection={"column"} align={"center"} mt={"15vh"}>
                                <Heading fontSize={"50px"}>Welcome !</Heading>
                                <Text fontSize={"20px"} color={"gray.500"}>Help the people, make big changes</Text>
                                <form>
                                    <FormControl id="value" mt={"5vh"} ml={"-25%"}>
                                        <FormLabel>Email</FormLabel>
                                        <InputGroup mt={-2} w={"150%"} >
                                            <Input
                                                type="string"
                                                borderColor={"gray.300"}
                                                placeholder={"johnnysilverhand@gmail.com"}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="value" mt={"3vh"} ml={"-25%"}>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup mt={-2} w={"150%"}>
                                            <Input
                                                type="string"
                                                borderColor={"gray.300"}
                                                placeholder={"xxxxxxxx"}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                </form>
                                <Button
                                    mt={"5vh"}
                                    w={"50%"}
                                    bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
                                    color={"white"}
                                    _hover={{
                                        bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
                                        boxShadow: "xl",
                                    }}
                                >
                                    Login
                                </Button>
                                <Flex marginTop={"15vh"}>
                                    <Text color={"gray.500"}>Don't have an account yet?</Text>
                                    <Button padding={0} margin={0} height={6} marginLeft={"1vw"} color={"#2C2C7B "} _hover={{
                                        bg: "#gray.100",
                                        color: "black"
                                    }}
                                        onClick={() => { setLoginPage(0) }}>Sign Up</Button>
                                </Flex>
                            </Flex>

                        </Box>) 
                        : 
                        (<Box height={"100vh"} width={"50vw"} bg={"gray.100"} display={"flex"} alignItems={"center"} justifyContent={"center"} borderLeft={"1px"} borderColor={"gray"}>
                            <Flex  width={"30vw"} flexDirection={"column"} align={"center"} mt={"15vh"}>
                                <Heading fontSize={"35px"}>Create your account</Heading>
                                <Text fontSize={"20px"} color={"gray.500"}>Please Enter your details</Text>
                                <form>
                                    <FormControl id="value" mt={"5vh"} ml={"-25%"}>
                                        <FormLabel>Email</FormLabel>
                                        <InputGroup mt={-2} w={"150%"} >
                                            <Input
                                                type="string"
                                                borderColor={"gray.300"}
                                                placeholder={"johnnysilverhand@gmail.com"}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="value" mt={"3vh"} ml={"-25%"}>
                                        <FormLabel>Username</FormLabel>
                                        <InputGroup mt={-2} w={"150%"} >
                                            <Input
                                                type="string"
                                                borderColor={"gray.300"}
                                                placeholder={"JohnnySilverhand"}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="value" mt={"3vh"} ml={"-25%"}>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup mt={-2} w={"150%"}>
                                            <Input
                                                type="string"
                                                borderColor={"gray.300"}
                                                placeholder={"xxxxxxxx"}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="value" mt={"3vh"} ml={"-25%"}>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <InputGroup mt={-2} w={"150%"}>
                                            <Input
                                                type="string"
                                                borderColor={"gray.300"}
                                                placeholder={"xxxxxxxx"}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                </form>
                                <Button
                                    mt={"5vh"}
                                    w={"50%"}
                                    bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
                                    color={"white"}
                                    _hover={{
                                        bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
                                        boxShadow: "xl",
                                    }}
                                >
                                    Sign Up
                                </Button>
                                <Flex marginTop={"15vh"}>
                                    <Text color={"gray.500"}>Already have an account ?</Text>
                                    <Button padding={0} margin={0} height={6} marginLeft={"1vw"} color={"#2C2C7B "} _hover={{
                                        bg: "#gray.100",
                                        color: "black"
                                    }}
                                        onClick={() => { setLoginPage(1) }}>Log In</Button>
                                </Flex>
                            </Flex>

                        </Box>)
                    }

                </Box>
            </main>
        </div>
    );
}
