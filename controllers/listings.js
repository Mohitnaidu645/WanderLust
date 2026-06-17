import Listing from "../models/listing.js";

export const index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

export const createOne=async(req,res)=>{
  let url= req.file.path;
  let filename= req.file.filename;
    const newList = new Listing(req.body.listing); 
      newList.image={url,filename};
      newList.owner = req.user._id; 
    await newList.save(); 
    req.flash("success","Listing created")
    res.redirect("/listings");
 };

 export const showRoute=async(req,res)=>{
  let {id}=req.params;
  const list=await Listing.findById(id).populate({path:"reviews",populate:"author",}).populate("owner");
  if(!list){
    req.flash("error","Listing not found");
    return res.redirect(`/listings`);
  }
  res.render("./listings/show.ejs",{list});
};

 export const updateRender=async(req,res)=>{
  let {id}=req.params;
  let List= await Listing.findById(id);
  if(!List){
    req.flash("error","Listing not found");
    return res.redirect(`/listings`);
  }
    res.render("./listings/edit.ejs",{List});
};

 export const updateOne=async (req, res) => {
   let { id } = req.params;
    const newList =  await Listing.findByIdAndUpdate(
      id,
      req.body.listing,
      {
         runValidators: true,
         new: true
      }
   );
   if(typeof req.file!=="undefined"){
     let url= req.file.path;
     let filename= req.file.filename;
   newList.image={url,filename};
    await newList.save();
   }
   req.flash("success","Listing updated Successfully!");
   res.redirect(`/listings/${id}`);

};

export const deleteOne=async(req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
};

export const ctgRecg=async(req,res)=>{
  const { category } = req.params;
  const allListings = await Listing.find({ category });
  if (!allListings || allListings.length === 0) {
    req.flash("error", "No listings found in this category");
    return res.redirect("/listings");
  }
  res.render("./listings/index.ejs", {allListings});
}
