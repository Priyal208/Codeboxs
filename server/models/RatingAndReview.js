const mongoose = require('mongoose')

const RatingAndReview = new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
   },
   rating:{
    type:Number,
    required:true,
   },
   review:{
    type:String,
    required:true,
   },
   course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
});

module.exports = mongoose.model("ratingandreview",RatingAndReview);