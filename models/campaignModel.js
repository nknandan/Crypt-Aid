import { Schema, model, models } from "mongoose";

const campaignSchema = new Schema({
  name: String,
  description: String,
  imageURL: String,
  minAmount: String,
  targetAmount: String,
});

const Campaign = models.Campaign || model("Campaign", campaignSchema);

export default Campaign;
