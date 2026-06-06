import express from "express";
const router=express.Router();
import Listing from "../models/listing.js"
import {reviewSchema} from "../schema.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Review from "../models/review.js";


const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
   }else{
    next();
   }
};

  
//review
//post
router.post("/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
  let listing= await Listing.findById(req.params.id);   
  let newReview=new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save() ;

  res.redirect(`/listings/${listing.id}`);
}));

//delete
router.delete("/:id/review/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull :{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);

}));

export default router;
