import Listing from "./models/listing.js";
import Review from "./models/review.js";
import {listingSchema} from "./schema.js";
import ExpressError from "./utils/ExpressError.js";
const isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You are not Logged in!");
        return res.redirect("/login");
    }

    next();
};

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};
const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
   }else{
    next();
   }
};

const isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const isAuthor=async (req,res,next)=>{
    let {reviewId,id}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You can't perform action if you not created this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

export { isLoggedin, saveRedirectUrl,validateListing,isOwner,isAuthor};