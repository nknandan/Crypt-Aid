import Campaign from "../../../models/campaignModel";
import { connectMongo } from "../../../utils/connectMongo";

export default async function addCampaign(req, res) {
  // GET
  if (req.method === "GET") {
    // Process a POST request
    try {
      await connectMongo();

      const campaign = await Campaign.find();

      res.json({ campaign });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
  // POST
  else if (req.method == "POST") {
    try {
      await connectMongo();
      const campaign = await Campaign.create(req.body);

      res.json({ campaign });
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  } else {
    // Handle any other HTTP method
  }
  
}
