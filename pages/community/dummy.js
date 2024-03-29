/* eslint-disable react/no-children-prop */
import Head from "next/head";
import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import { useForm } from "react-hook-form";
import { Grid, GridItem, textDecoration } from "@chakra-ui/react";
import { IoIosPodium } from "react-icons/io";
import { useRouter } from "next/router";
import { useWindowSize } from "react-use";
import { getETHPrice, getETHPriceInUSD, getWEIPriceInUSD } from "../../lib/getETHPrice";
import {
    Box,
    Image,
    Flex,
    Stack,
    Heading,
    Skeleton,
    Text,
    Container,
    Input,
    Img,
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
    Icon,
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
import { Line } from "@react-pdf/renderer";
import { ChevronDownIcon, SunIcon } from "@chakra-ui/icons";

function CommentInbox() {

    const [comments, setComments] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const newComment = event.target.comment.value;
        setComments([...comments, newComment]);
        event.target.comment.value = '';
    };

    return (
        <Box w={"100%"} justifyContent={"space-between"}>
            <Flex flexDir={"row"} w={"100%"} justifyContent={"space-between"} mb={"2%"} mt={4}>
                <Box w={"80%"}>
                    <form>
                        <FormControl id="value">
                            <InputGroup w={"100%"}>
                                <Input
                                    type="string"
                                    borderColor={"gray.300"}
                                    placeholder={"Enter your post here"}
                                    onChange={(e) => {

                                    }}
                                />
                            </InputGroup>
                        </FormControl>
                    </form>
                </Box>
                <Button
                    w={"15%"}
                    bgGradient="linear(to-l, #2C2C7B, #1CB5E0)"
                    color={"white"}
                    _hover={{
                        bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
                        boxShadow: "xl",
                    }}
                    onClick={() => {
                    }}
                    borderRadius={20}
                >
                    Post
                </Button>
            </Flex>
        </Box>
    );
}

export default function CommunitySingle({
}) {
    const [joined, setJoined] = useState(1);
    const [newButton, setNewButton] = useState(1);
    const [popularButton, setPopularButton] = useState(0);
    const [trendingButton, setTrendingButton] = useState(0);
    return (
        <div>
            <Head>
                <title>Community Details</title>
                <meta name="description" content="Create a Withdrawal Request" />
                <link rel="icon" href="/logo.svg" />
            </Head>
            <main>
                {" "}
                <Flex px={"17.5vw"} direction={"column"} gap={"3vw"}>
                    <Box w={"100%"} h={"250px"}>
                        <Img
                            w={"100%"}
                            h={"100%"}
                            src={"https://www.smartcompany.com.au/wp-content/uploads/2017/10/That-Startup-Show-image.jpg?fit=641%2C333"}
                            objectFit="cover"
                            borderRadius={30}
                        />
                    </Box>
                    <Flex w={"100%"} justifyContent={"space-between"} alignItems={"flex-start"}>
                        <Flex w={"66%"} flexDir={"column"}>
                            <Flex justifyContent={"space-between"}
                                alignItems={"center"}
                                borderRadius={8} p={6} py={2}
                                borderWidth={1}
                                borderColor={"gray.300"}
                                w={"100%"}
                            >
                                <Heading fontSize={"44px"}>BRUJOS</Heading>
                                {joined ? (<Button
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
                                </Button>) : (
                                    <Button
                                        w={"25%"}
                                        borderRadius={50}
                                        bgColor={"#1CB5E0"}
                                        color={"white"}
                                        zIndex={99}
                                        _hover={{
                                            bgGradient: "linear(to-l, #2C2C7B, #1CB5E0)",
                                            boxShadow: "xl",
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setJoined(!joined);
                                        }}
                                    >
                                        Join
                                    </Button>
                                )}
                            </Flex>
                            <Box borderWidth={1} borderColor={"gray.300"} p={4} borderRadius={8} my={6}>
                                <Heading
                                    lineHeight={1}
                                    fontSize={{ base: "2xl", sm: "3xl" }}
                                    color={useColorModeValue("#2C2C7B", "teal.200")}
                                >
                                    Create a post
                                </Heading>
                                <Box w={"100%"} alignContent={"center"} justifyContent={"center"}>
                                    <CommentInbox />
                                </Box>
                            </Box>
                            <Flex w={"100%"} bgColor={"gray.200"} p={2} alignItems={"center"} mt={4} borderRadius={8}>
                                <Button
                                    colorScheme="blue"
                                    variant="ghost"
                                    isActive={newButton}
                                    borderRadius={20}
                                    mr={5}
                                    onClick={() => {
                                        setNewButton(1);
                                        setTrendingButton(0);
                                    }}
                                    _hover={{ bg: "gray.300" }}
                                >
                                    <SunIcon />
                                    <Text ml={2}>New</Text>
                                </Button>

                                <Button
                                    colorScheme="blue"
                                    variant="ghost"
                                    isActive={trendingButton}
                                    borderRadius={20}
                                    onClick={() => {
                                        setNewButton(0);
                                        setTrendingButton(1);
                                    }}
                                    _hover={{ bg: "gray.300" }}
                                >
                                    <Icon as={IoIosPodium} /> <Text ml={2}>Trending</Text>
                                </Button>
                            </Flex>
                        </Flex>
                        <Box w={"30%"}>
                            <Box borderWidth={1} borderColor={"gray.300"} borderRadius={8} p={5}>
                                <Text color={"#2C2C7B"} fontWeight={600} fontSize={"22px"}>About community</Text>
                                <Text mt={2}>Bassiste, contrebassiste et compositeur, après avoir travaillé pour de nombreux artistes depuis plus de 20 ans et enregistré près de 50 albums, je présente en 2023 mon 3 em Album</Text>
                                <Text color={"gray.600"} mt={2} fontWeight={200}>Created Jan 25, 2012</Text>
                                <Box w={"100%"} bgColor={"gray.300"} h={"1px"} mt={1}></Box>
                                <Flex w={"100%"} justifyContent={"space-evenly"}>
                                    <Flex alignItems={"center"} justifyContent={"center"} flexDirection={"column"} py={3}>
                                        <Text fontWeight={600} fontSize={"22px"} color={"#2C2C7B"}>452</Text>
                                        <Text fontSize={"12px"} color={"gray.600"}>Members</Text>
                                    </Flex>
                                    <Flex alignItems={"center"} justifyContent={"center"} flexDirection={"column"} py={3}>
                                        <Text fontWeight={600} fontSize={"22px"} color={"#2C2C7B"}>17</Text>
                                        <Text fontSize={"12px"} color={"gray.600"}>Posts</Text>
                                    </Flex>
                                </Flex>
                                <Box w={"100%"} bgColor={"gray.300"} h={"1px"} mt={1}></Box>
                                <Box my={5}>
                                    <Button
                                        w={"100%"}
                                        borderRadius={50}
                                        bgColor={"#43B0F1"}
                                        color={"white"}
                                        zIndex={99}
                                        _hover={{
                                            bgGradient: "linear(to-l, #0065A1, #43B0F1)",
                                            boxShadow: "xl",
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setJoined(!joined);
                                        }}
                                    >
                                        Create Post
                                    </Button>
                                </Box>
                                <Box w={"100%"} bgColor={"gray.300"} h={"1px"} mt={1}></Box>
                                <Text mt={2} color={"gray.600"} fontWeight={500} fontSize={"18px"}>Moderators</Text>
                                <Flex px={4} alignItems={"center"} >
                                    <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                                    <Text color={"black"}>HarshaRocks</Text>
                                </Flex>
                            </Box>
                            <Box borderWidth={1} borderColor={"gray.300"} borderRadius={8} p={5} mt={6}>
                                <Text color={"#2C2C7B"} fontWeight={600} fontSize={"22px"}>Note from the moderation team</Text>
                                <Text mt={2}>Bassiste, contrebassiste et compositeur, après avoir travaillé pour de nombreux artistes depuis plus de 20 ans et enregistré près de 50 albums, je présente en 2023 mon 3 em Album</Text>
                            </Box>
                            <Box borderWidth={1} borderColor={"gray.300"} borderRadius={8} p={5} mt={6}>
                                <Text color={"#2C2C7B"} fontWeight={600} fontSize={"22px"}>Members</Text>
                                <Flex px={4} alignItems={"center"} mt={2} >
                                    <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                                    <Text color={"black"}>HarshaRocks</Text>
                                </Flex>
                                <Flex px={4} alignItems={"center"} >
                                    <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                                    <Text color={"black"}>HarshaRocks</Text>
                                </Flex>
                                <Flex px={4} alignItems={"center"} >
                                    <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                                    <Text color={"black"}>HarshaRocks</Text>
                                </Flex>
                                <Flex px={4} alignItems={"center"} >
                                    <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                                    <Text color={"black"}>HarshaRocks</Text>
                                </Flex>
                                <Flex px={4} alignItems={"center"} >
                                    <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                                    <Text color={"black"}>HarshaRocks</Text>
                                </Flex>
                                <Flex px={4} alignItems={"center"} >
                                    <Box borderRadius={"50%"} bgColor={"#609966"} w={"10px"} h={"10px"} mr={2}></Box>
                                    <Text color={"black"}>HarshaRocks</Text>
                                </Flex>
                            </Box>
                        </Box>

                    </Flex>

                </Flex>
            </main>
        </div>
    );
}
