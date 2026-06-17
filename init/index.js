import mongoose from "mongoose";
import initData from "./data.js"
import Listing from "../models/listing.js"
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// Connect to DB first
await connectDB();

const initDb=async ()=>{
  initData.data= initData.data.map((obj)=>({...obj,owner:"6a26ef788fff2d96abd49cca"}));
    await Listing.insertMany(initData.data);
    console.log("data initialized");

};

initDb();