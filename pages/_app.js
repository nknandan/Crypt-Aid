import "../styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { UseWalletProvider } from "use-wallet";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
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
            chainId={parseInt(process.env.CHAIN_ID)}
            connectors={{
              walletconnect: {
                // rpcUrl: "https://goerli.infura.io/v3/45506ce6184f433aa07ed69c689ff539", // GOERLI END POINT
                rpcUrl: process.env.LINK,
              },
            }}
          >
            <NavBar />
            <Component {...pageProps} />
            <Footer />{" "}
          </UseWalletProvider>
        </ChakraProvider>
      </>
    </UserProvider>
  );
}

export default MyApp;
