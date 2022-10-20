import Campaign from "../../../models/campaignModel";
import { connectMongo } from "../../../utils/connectMongo";

export default async function addCampaign(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("CREATING DATABASE");
    const campaign = await Campaign.create(req.body);
    console.log("CREATED DATABASE VARIABLE");

    res.json({ campaign });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
