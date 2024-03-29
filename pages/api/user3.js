import User from "../../models/user";
import { connectMongo } from "../../utils/connectMongo";
import { connectToDatabase } from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function addUser(req, res) {
  //
  // GET
  //
  if (req.method === "GET") {
    try {
      await connectMongo();
      const users = await User.find();

      res.json({ users });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
  //
  // POST
  //
  else if (req.method == "POST") {
    try {
      const { db } = await connectToDatabase();
      const temp = req.body;
      console.log(temp.thisUser);
      const em = temp.thisUser.email;
      const pn = temp.thisUser.phoneNumber;
      const u = await db
        .collection("users")
        .updateOne({ email: em }, { $set: { phoneNumber: pn } });
      res.json({ u });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  } else if (req.method == "PUT") {
    try {
      const { db } = await connectToDatabase();
      const temp = req.body;
      console.log(temp.thisUser);
      const em = temp.thisUser.email;
      const pv = temp.thisUser.pendingVerification;
      const pc = temp.thisUser.verificationComplete;
      const u = await db
        .collection("users")
        .updateOne({ email: em }, { $set: { pendingVerification: pv, verificationComplete: pc } });
      res.json({ u });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
}
