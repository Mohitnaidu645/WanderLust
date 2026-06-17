import express from "express";
const router=express.Router();

import wrapAsync from "../utils/wrapAsync.js";
import {isLoggedin,validateListing,isOwner} from "../middleware.js";
import * as listingController from "../controllers/listings.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";
const upload=multer({storage});

//indexRoute
router.get("/", wrapAsync(listingController.index));

//createRoute 
router.get("/new",isLoggedin,(req,res)=>{
  res.render("./listings/new.ejs");
});
router.post("/newlist",isLoggedin,upload.single('image'),validateListing,wrapAsync(listingController.createOne));

//show route
router.get("/category/:category", wrapAsync(listingController.ctgRecg));
router.get("/:id", wrapAsync(listingController.showRoute));


//update
router.get("/listup/:id",isLoggedin,isOwner,wrapAsync(listingController.updateRender));
router.put("/listupd/:id",validateListing,upload.single('image'),isOwner, wrapAsync(listingController.updateOne));


//delete
router.delete("/list/del/:id",isLoggedin,isOwner,wrapAsync(listingController.deleteOne));

export default router;
