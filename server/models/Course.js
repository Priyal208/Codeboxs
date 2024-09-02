const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String
    },
    courseDescription:{
        type:String
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }],
    ratingandreview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    }],
    price:{
        type:Number,
    },
    thumbNail:{
        type:String,
    },
    tag: {
		type: [String],
		required: true,
	},
   category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },

    studentEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }]    
});

module.exports = mongoose.model("Course",courseSchema);