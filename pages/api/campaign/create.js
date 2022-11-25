import Campaign from "../../../models/campaignModel";
import { connectMongo } from "../../../utils/connectMongo";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function addCampaign(req, res) {
  // GET
  if (req.method === "GET") {
    // Process a POST request
    try {
      const { db } = await connectToDatabase();

      const campaign = await db.collection("campaigns").find({});

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
  } else {
    // Handle any other HTTP method
  }
}
