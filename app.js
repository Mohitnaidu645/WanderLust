import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import dotenv from "dotenv";
import Listing from "./models/listing.js"
import ejsMate from "ejs-mate";
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


//index route
app.get("/wanderlust",async (req,res)=>{
  const allListings=await Listing.find({});
  res.render("index.ejs",{allListings});
});

//show route
app.get("/listing/:id",async(req,res)=>{
  let {id}=req.params;
  const list=await Listing.findById(id);
  res.render("show.ejs",{list});
})
app.get("/add",(req,res)=>{
  res.render("new.ejs");
})

app.post("/newlist",async(req,res)=>{
  let {title,description,price,location,country}=req.body;

    let newList=new Listing({
      newtitle:title,
      newdescription:description,
      newimg:image,
      newprice:price,
      newLoc:location,
      newcoun:country
    });
  await newList.save().then(()=>{
    console.log("List Saved=");
  }).catch((err)=>{
    console.log(err);
  })
  res.redirect("/wanderlust");
});

app.get("/listup/:id",async(req,res)=>{
  let {id}=req.params;
  let List= await Listing.findById(id);
    res.render("edit.ejs",{List});
})
app.put("/listupd/:id",async(req,res)=>{
  let {id}=req.params;
    let {title:newtitle,description:newdesc,price:newprc,location:newloc,country:newcou}=req.body;
    let updlist= await Listing.findByIdAndUpdate(id,
      {title :newtitle,description:newdesc,price:newprc,location:newloc,country:newcou},
      {runValidators:true,new:true}
    );
    res.redirect("/wanderlust");
});

app.delete("/list/del/:id",async(req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    res.redirect("/wanderlust");
});