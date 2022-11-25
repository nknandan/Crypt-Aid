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
            chainId={1337}
            connectors={{
              walletconnect: {
                // rpcUrl: "https://goerli.infura.io/v3/45506ce6184f433aa07ed69c689ff539", // GOERLI END POINT
                rpcUrl: "http://127.0.0.1:7545",
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
