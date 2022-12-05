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
              <Td>
                <NextLink href={`/campaign/${mapping[item["5"]]}`} color={"blue"} cursor={"pointer"}>
                  <Text
                    color={"blue.500"}
                    cursor={"pointer"}
                    _hover={{
                      color: "blue.800",
                    }}
                  >
                    {item["5"]}
                  </Text>
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
