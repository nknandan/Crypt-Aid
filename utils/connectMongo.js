import mongoose from "mongoose";
mongoose.set("strictQuery", true);

export const connectMongo = async () => mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
