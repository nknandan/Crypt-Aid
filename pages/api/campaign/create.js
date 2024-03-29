import Campaign from "../../../models/campaignModel";
import { connectMongo } from "../../../utils/connectMongo";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function addCampaign(req, res) {
  // GET
  if (req.method === "GET") {
    // Process a GET request
    try {
      const { db } = await connectToDatabase();

      const campaign = await db.collection("campaigns").find({}).toArray();
      console.log(campaign);
      res.json({ campaign });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
  // POST
  else if (req.method == "POST") {
    try {
      const { db } = await connectToDatabase();
      const temp = req.body;
      console.log(temp);
      const u = await db.collection("campaigns").insertOne(temp);
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
      const approval = temp.tempObj.isApproved;
      const nm = temp.tempObj.name;
      const u = await db.collection("campaigns").updateOne({ name: nm }, { $set: { isApproved: approval } });
      console.log(u);
      res.json({ u });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
}
