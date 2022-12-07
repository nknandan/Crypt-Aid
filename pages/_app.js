import "../styles/globals.css";
import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { UseWalletProvider } from "use-wallet";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import DarkModeSwitch from "../components/DarkModeSwitch";
import { UserProvider } from "@auth0/nextjs-auth0";

const theme = extendTheme({
  fonts: {
    heading: "Space Grotesk",
    body: "Space Grotesk",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <>
        {" "}
        <ChakraProvider theme={theme}>
          <UseWalletProvider
            chainId={parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)}
            // chainId={1337}
            connectors={{
              walletconnect: {
                // rpcUrl: "https://goerli.infura.io/v3/45506ce6184f433aa07ed69c689ff539", // GOERLI END POINT
                rpcUrl: process.env.NEXT_PUBLIC_LINK,
                // rpcUrl: "http://127.0.0.1:7545",
              },
            }}
          >
            <NavBar />
            <Component {...pageProps} />
            {/* <Flex pos={"fixed"} top={"10px"} right={"8vh"} zIndex={1000}>
              <DarkModeSwitch />
            </Flex> */}

            <Footer />{" "}
          </UseWalletProvider>
        </ChakraProvider>
      </>
    </UserProvider>
  );
}

export default MyApp;
