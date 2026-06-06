import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import dotenv from "dotenv";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import listings from "./routes/listing.js";
import reviews from "./routes/review.js";
dotenv.config();


const port = 8040;
const app = express();

import { fileURLToPath } from "url";
import path from "path";

 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate)

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

//test route
app.listen(port, () => {
  console.log(`server running on ${port}`);
});

app.use("/listings",listings);
app.use("/listings",reviews);


//err handle
 app.use((req,res,next)=>{
  next(new ExpressError(404,"page not found"));
 })

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"}= err;
    res.status(statusCode).render("error.ejs",{message});
});  
