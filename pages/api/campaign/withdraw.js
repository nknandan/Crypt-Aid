import Campaign from "../../../models/campaignModel";
import { connectMongo } from "../../../utils/connectMongo";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function addCampaign(req, res) {
  // GET
  if (req.method === "GET") {
    // Process a POST request
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
      const nm = temp.thisCamp.name;
      const am = temp.thisCamp.withdrawnAmount;
      const u = await db.collection("campaigns").updateOne({ name: nm }, { $set: { withdrawnAmount: am } });
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
      const fc = temp.thisCamp.flaggedCampaign;
      const nm = temp.thisCamp.name;
      const u = await db.collection("campaigns").updateOne({ name: nm }, { $set: { flaggedCampaign: fc } });
      res.json({ u });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
}
