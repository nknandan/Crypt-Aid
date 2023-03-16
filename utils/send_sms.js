// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountSid = "AC66bce3373e247b8cc9c85b0b680ab988";
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const authToken = "a243c33df98de1effe3a143c09e0279a";
const client = require("twilio")(accountSid, authToken);

require("dotenv").config();

client.messages
  .create({
    body: "123456 is your OTP for verification",
    from: "+15075854494",
    to: NEXT_PUBLIC_PHONE_NUMBER,
  })
  .then((message) => console.log(message.sid));
