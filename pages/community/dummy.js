/* eslint-disable react/no-children-prop */
import Head from "next/head";
import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import { useForm } from "react-hook-form";
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

export default function CommunitySingle({
}) {
    const [joined, setJoined] = useState(1);
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
                        <Flex justifyContent={"space-between"} w={"60%"} alignItems={"center"}>
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
                        <Box w={"30%"} borderWidth={1} borderColor={"gray.300"} borderRadius={8} p={5}>
                            <Text color={"#2C2C7B"} fontWeight={600}>About community</Text>
                            <Text mt={4}>Bassiste, contrebassiste et compositeur, après avoir travaillé pour de nombreux artistes depuis plus de 20 ans et enregistré près de 50 albums, je présente en 2023 mon 3 em Album</Text>
                            <Text color={"gray.600"} mt={2} fontWeight={200}>Created Jan 25, 2012</Text>
                            <Box w={"100%"} bgColor={"gray.300"} h={"1px"} mt={1}></Box>
                            <Flex w={"100%"}>
                                <Flex alignItems={"center"} justifyContent={"center"} flexDirection={"column"} py={3}>
                                    <Text fontWeight={600} fontSize={"22px"}>452</Text>
                                    <Text fontSize={"12px"} color={"gray.600"}>Members</Text>
                                </Flex>
                            </Flex>
                        </Box>
                    </Flex>

                </Flex>
            </main>
        </div>
    );
}
