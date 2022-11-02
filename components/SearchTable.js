const SearchTable = ({ searchData }) => {
  console.log("NOW");

  const data = searchData ?? [];
  console.log(data);
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
