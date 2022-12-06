import React from "react";
import { Page, Document, StyleSheet } from "@react-pdf/renderer";
import {
  Text,
} from "@chakra-ui/react";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: "red",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 52,
    marginBottom: 20,
    textAlign: "center",
    color: "deepskyblue",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const PDFFile = () => {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>{"\n\n"}CryptAid</Text>
        <Text style={{
          margin: 22,
          marginBottom: 54,
          fontSize: 34,
          textAlign: "center",
          fontFamily: "Times-Roman",
          color: "grey"
        }}>
          Donation Receipt
        </Text>
        <Text style={{
          margin: 12,
          fontSize: 14,
          textAlign: "justify",
          fontFamily: "Times-Roman",
        }}>
          Thank you for your gift!
        </Text>
        <Text style={{
          margin: 12,
          marginBottom: 150,
          fontSize: 14,
          textAlign: "justify",
          fontFamily: "Times-Roman",
        }}>
          This receipt is an attestation that we have gratefully received your generous contribution to the campaign "Random Campaign Name".
        </Text>
        <Text style={{ fontSize: 22, fontWeight: 400, margin: 12, fontFamily: "Times-Roman"}}>
          Receipt Number : randomreceiptnumber
        </Text>
        <Text style={{ fontSize: 22, fontWeight: 800, margin: 12, fontFamily: "Times-Roman", textDecoration: "underline" }}>
          Donor's Name
        </Text>
        <Text style={{ fontSize: 18, margin: 12, marginTop: 0, fontFamily: "Times-Roman", }}>
          Alvin Antony Shaju
        </Text>
        <Text style={{ fontSize: 22, fontWeight: 800, margin: 12, fontFamily: "Times-Roman", textDecoration: "underline" }}>
          Donation Received By
        </Text>
        <Text style={{ fontSize: 18, margin: 12, marginTop: 0, fontFamily: "Times-Roman", }}>
          HariKrishan U
        </Text>
        <Text style={{ fontSize: 22, fontWeight: 800, margin: 12, fontFamily: "Times-Roman", textDecoration: "underline" }}>
          Date Donated
        </Text>
        <Text style={{ fontSize: 18, margin: 12, marginTop: 0, fontFamily: "Times-Roman", }}>
          Current date
        </Text>
        <Text style={{ fontSize: 22, fontWeight: 800, margin: 12, fontFamily: "Times-Roman", textDecoration: "underline" }}>
          Donation Amount
        </Text>
        <Text style={styles.text}>
          A donation of 100ETH has been transferred from loki1 to loki2.
        </Text>
      </Page>
    </Document>
  );
};

export default PDFFile;