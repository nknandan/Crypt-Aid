import { schema, model, models, Schema } from "mongoose";

const campaignSchema = new Schema({
  name: String,
  description: String,
  imageURL: String,
  minAmount: Float32Array,
  targetAmount: Float32Array,
});

const Campaign = models.Campaign || model("Campaign", campaignSchema);

export default Campaign;
