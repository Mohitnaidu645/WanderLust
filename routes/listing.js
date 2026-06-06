import express from "express";
const router=express.Router();
import Listing from "../models/listing.js"
import {listingSchema} from "../schema.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";

const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
   }else{
    next();
   }
};

//index route
router.get("/",wrapAsync(async (req,res)=>{
  const allListings=await Listing.find({});
  res.render("index.ejs",{allListings});
}));


//new 
router.get("/new",(req,res)=>{
  res.render("new.ejs");
});

router.post("/newlist",validateListing,wrapAsync(
  async(req,res)=>{
    const newList = new Listing(req.body.listing);    
    await newList.save(); 
    res.redirect("/listings");
 }
));

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const list=await Listing.findById(id).populate("reviews");
  res.render("show.ejs",{list});
}));


//update
router.get("/listup/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let List= await Listing.findById(id);
    res.render("edit.ejs",{List});
}));
router.put("/listupd/:id",validateListing, wrapAsync(async (req, res) => {

   let { id } = req.params;
    const newList =  await Listing.findByIdAndUpdate(
      id,
      req.body.listing,
      {
         runValidators: true,
         new: true
      }
   );

   res.redirect(`/listings/${id}`);

}));


//delete
router.delete("/list/del/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

export default router;