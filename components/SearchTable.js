import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";

// mapping is a {} with  {item["5"] : id}

const SearchTable = ({ searchData, mapping }) => {
  const data = searchData ?? [];
  return (
    <>
      {/* <h1>Hello World</h1> */}
      <table>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item["5"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default SearchTable;
