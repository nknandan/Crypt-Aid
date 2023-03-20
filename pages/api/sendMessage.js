import twilio from "twilio";

export default function sendMessage(req, res) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  const phoneNumber = req.body.phone;
  const otp = Math.floor(100000 + Math.random() * 900000);
  client.messages
    .create({
      body: otp + " is your OTP for verification",
      from: "+15075854494",
      to: "+91" + phoneNumber,
    })
    .then((message) => {
      console.log("CHECK Phone");
      res.json({
        success: true,
        otp: otp,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
        otp: otp,
      });
    });
}
