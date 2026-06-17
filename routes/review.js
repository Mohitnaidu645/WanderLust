import express from "express";
const router=express.Router();

import {reviewSchema} from "../schema.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { isLoggedin,isAuthor } from "../middleware.js";
import * as reviewController from "../controllers/reviews.js"

const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
   }else{
    next();
   }
};

  
//post
router.post("/:id/reviews",isLoggedin,validateReview,wrapAsync(reviewController.createRev));

//delete
router.delete("/:id/review/:reviewId",isLoggedin,isAuthor,wrapAsync(reviewController.revDel));

export default router;
