import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";
import NextLink from "next/link";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
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
  Center,
} from "@chakra-ui/react";

// mapping is a {} with  {item["5"] : id}

const SearchTable = ({ searchData, mapping }) => {
  const data = searchData ?? [];
  return (
    <>
      {/* <h1>Hello World</h1> */}
      <Table>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.id}>
              <Td p={3} pl={10}>
                <NextLink href={`/campaign/${mapping[item["5"]]}`} color={"blue"} cursor={"pointer"}>
                  <Center flexDir={"row"} p={0} justifyContent={"flex-start"} transition={"transform 0.3s ease"}
                    _hover={{
                      transform: "translateY(-3px)",
                    }}>
                    <Img h={"80px"} w={"80px"} borderRadius={"20%"} src={item["7"]} mr={"30px"} fill={"contain"} />
                    <Text
                      color={"blue.600"}
                      cursor={"pointer"}
                      _hover={{
                        color: "blue.800",
                      }}
                      fontSize={20}
                    >
                      {item["5"]}
                    </Text>
                  </Center>
                </NextLink>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default SearchTable;
