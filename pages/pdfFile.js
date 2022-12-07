import React from "react";
import { Page, Document, StyleSheet } from "@react-pdf/renderer";
import { Text } from "@chakra-ui/react";

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

const PDFFile = ({ donName, donAm, donDate, campName, creName }) => {
  var d = new Date();
  var t = new Date().getTime();
  var randomnum = Math.floor(Math.random() * (1000 - 500000)) + 1000;
  randomnum = d.getFullYear() + (d.getMonth() + 1) + d.getDate() + randomnum;
  randomnum = randomnum + t;
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>
          {"\n\n"}CryptAid
        </Text>
        <Text
          style={{
            margin: 22,
            marginBottom: 54,
            fontSize: 34,
            textAlign: "center",
            fontFamily: "Times-Roman",
            color: "grey",
          }}
        >
          Donation Receipt
        </Text>
        <Text
          style={{
            margin: 12,
            fontSize: 14,
            textAlign: "justify",
            fontFamily: "Times-Roman",
          }}
        >
          Thank you for your gift!
        </Text>
        <Text
          style={{
            margin: 12,
            marginBottom: 150,
            fontSize: 14,
            textAlign: "justify",
            fontFamily: "Times-Roman",
          }}
        >
          This receipt is an attestation that we have gratefully received your generous contribution to the campaign{" "}
          {campName}.
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 400,
            margin: 12,
            fontFamily: "Times-Roman",
          }}
        >
          Receipt Number : {randomnum}
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: 12,
            fontFamily: "Times-Roman",
            textDecoration: "underline",
          }}
        >
          Donor Name
        </Text>
        <Text
          style={{
            fontSize: 18,
            margin: 12,
            marginTop: 0,
            fontFamily: "Times-Roman",
          }}
        >
          {donName}
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: 12,
            fontFamily: "Times-Roman",
            textDecoration: "underline",
          }}
        >
          Donation Received By
        </Text>
        <Text
          style={{
            fontSize: 18,
            margin: 12,
            marginTop: 0,
            fontFamily: "Times-Roman",
          }}
        >
          {creName}
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: 12,
            fontFamily: "Times-Roman",
            textDecoration: "underline",
          }}
        >
          Date Donated
        </Text>
        <Text
          style={{
            fontSize: 18,
            margin: 12,
            marginTop: 0,
            fontFamily: "Times-Roman",
          }}
        >
          {donDate}
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 800,
            margin: 12,
            fontFamily: "Times-Roman",
            textDecoration: "underline",
          }}
        >
          Donation Amount
        </Text>
        <Text
          style={{
            fontSize: 18,
            margin: 12,
            marginTop: 0,
            fontFamily: "Times-Roman",
          }}
        >
          ${donAm}
        </Text>
      </Page>
    </Document>
  );
};

export default PDFFile;
