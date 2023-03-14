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
      const uv = temp.tempObj.upVoters;
      const dv = temp.tempObj.downVoters;
      console.log(temp.tempObj);
      const nm = temp.tempObj.name;
      const u = await db.collection("campaigns").updateOne({ name: nm }, { $set: { upVoters: uv, downVoters: dv } });
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
      const c = temp.tempObj.comments;
      const nm = temp.tempObj.name;
      const u = await db.collection("campaigns").updateOne({ name: nm }, { $set: { comments: c } });
      console.log(u);
      res.json({ u });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
}
