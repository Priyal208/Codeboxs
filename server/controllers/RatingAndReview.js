const { default: mongoose } = require('mongoose');
const RatingAndReview = require('../models/RatingAndReview');
const ratingandreview = require('../models/RatingAndReview')
const Course = require('../models/RatingAndReview');

exports.createRating = async(req,res) => {
    try {
        const userId = req.user.id;
        const {rating, review, courseId} = req.body;
        const courseDetails = await Course.findOne({
            _id:courseId,
            studentEnrolled: {$elemMatch: {$eq: userId}},
        });
        if(!courseDetails || !userId){
            return res.status(404).json({
                success: false,
                message: "User not registered",
                error: error.message,
              });
        }

        const alreadyReviewed = await ratingandreview.findOne({
            userId:userId,
            course:courseId,
        })

        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "User already reviewed the course",
                error: error.message,
              });
        }

        const ratingAndReview = await RatingAndReview.create({
            rating, review, course:courseId, user:userId,
        });

        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    ratingandreview: ratingAndReview.id,
                }
            },
            {new:true}
        )

        return res.status(200).json({
            success: true,
            message: "rating created sucesfully",
          });
    } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
    }
}

exports.getAverageRating = async(req,res) => {
    try {

        const courseId = req.body.courseId;
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:NULL,
                    averageRating: {$avg: "$rating"},
                }   
            },
            {

            }
        ])

        if(result.length > 0){
            return res.status(200).json({
                success: true,
                message: "ratings fetched  sucesfully",
                averageRating: result[0].averageRating,
              });
        }

        return res.status(200).json({
            success: true,
            message: "No ratings given so zero",
            averageRating: 0,
          });
        

        
    } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
    }
}

exports.getAllRatings = async(req,res) => {
    try {

        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"})
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image"
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName"
                                                })
                                                .exec();

        return res.status(200).json({
            success: true,
            message: "rating fetched  sucesfully",
            data: allReviews
          });
    } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
    }
}