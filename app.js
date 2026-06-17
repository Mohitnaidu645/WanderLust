import dotenv from "dotenv";
if(process.env.NODE_ENV!="production"){
  dotenv.config();  
}

import express from "express";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import listingsRoutes from "./routes/listing.js";
import reviewsRoutes from "./routes/review.js";
import session from "express-session";
import mongoStore from "connect-mongo";
import flash from "connect-flash";
import  passport from "passport";
import localStrategy from "passport-local";
import user from "./models/user.js";
import userRoutes from "./routes/User.js";

const port = 8040;
const app = express();

const store=mongoStore.create({
   mongoUrl:process.env.MONGO_URL,
   crypto:{
    secret:process.env.SECRET,
    touchAfter:24*3600,
   }
  });

const sessionOptions={
  store,
    secret :process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
       expires:Date.now()+7*24*60*60*1000,
       maxAge:7*24*60*60*1000,
       httpOnly:true
    }
};


import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";


 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})


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

app.use("/listings",listingsRoutes);
app.use("/listings",reviewsRoutes);
app.use("/",userRoutes);


//err handle
 app.use((req,res,next)=>{
  next(new ExpressError(404,"page not found"));
 })

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"}= err;
    res.status(statusCode).render("error.ejs",{message});
});  
