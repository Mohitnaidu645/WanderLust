import Review from "../models/review.js";
import {reviewSchema} from "../schema.js";
import Listing from "../models/listing.js";

export const createRev=async(req,res)=>{
  let listing= await Listing.findById(req.params.id);   
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  
  await listing.save() ;

  res.redirect(`/listings/${listing.id}`);
};

export const revDel=async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull :{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
};