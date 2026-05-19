import mongoose from "mongoose";
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
      type:String,
      required:true,   
    },
    description: String,
   image:{
        filename:{
            type:String,
            default:"listingimage",
        },

        url:{
            type:String,
            default:"https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=1267&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },},
    price: Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);
export default Listing;