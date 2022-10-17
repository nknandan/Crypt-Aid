import connectMongo from "../../utils/connectMongo";
import Campaign from "../../../models/campaignModel";

export default async function createCampaign(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("CREATING DATABASE FILE");
    const campaign = await Campaign.create(req.body);
    console.log("ADDED TO DATABASE");

    res.json({ campaign });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
