import User from "../../../models/campaignModel";
import { connectMongo } from "../../../utils/connectMongo";
import clientPromise from "../../lib/mongodb";

export default async function addCampaign(req, res) {
  //
  // GET
  //
  if (req.method === "GET") {
    try {
      await connectMongo();

      const campaign = await Campaign.find();

      res.json({ campaign });
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
      await connectMongo();

      const user = await User.create(req.body);

      res.json({ user });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  } else {
    // Handle any other HTTP method
  }
}
