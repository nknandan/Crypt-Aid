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
      console.log(temp);
      const em = temp.tempUser.email;
      const cc = temp.tempUser.createdCampaigns;
      const u = await db
        .collection("users")
        .updateOne({ email: em }, { $set: { createdCampaigns: cc } });
      console.log(u);
      res.json({ u });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  } else if (req.method == "PUT") {
    try {
      const { db } = await connectToDatabase();
      const temp = req.body;
      console.log(temp);
      const em = temp.tempUser.email;
      const dc = temp.tempUser.donatedCampaigns;
      const da = temp.tempUser.donatedAmount;
      const u = await db
        .collection("users")
        .updateOne(
          { email: em },
          { $set: { donatedCampaigns: dc, donatedAmount: da } }
        );
      console.log(u);
      res.json({ u });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
}
