const Course = require("../models/Course")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/CourseProgress")
require('dotenv').config();
const Profile = require("../models/Profile")
 
exports.updateProfile = async(req,res) => {
    try {
        const {dateOfBirth="", about="", contactNumber, gender, firstName, lastName} = req.body;
        const id = req.user.id;
        if(!contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:"Fields missing",
            });
        }

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const  profileDetails = await Profile.findById(profileId);

        userDetails.firstName = firstName;
        userDetails.lastName = lastName;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();
        await userDetails.save();

        return res.status(200).json({
            success: true,
            message: "profile updated  sucesfully",
            data: userDetails
          });
    } 
    
    catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
    }
}

exports.deleteProfile = async(req,res) => {
    try {
        const id = req.body;
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User NOT found",
            });
        }

        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success: true,
            message: "profile deleted sucesfully",
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

exports.getAllUserDetails = async(req,res) => {
    try {

        const id = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
            success: true,
            message: "profile details fetched sucesfully",
            userDetails
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

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id;
      let userDetails = await User.findOne({ _id: userId })
        .populate({
          path: 'courses',
          populate: {
            path: 'courseContent',
            populate: {
              path: 'SubSection',
            },
          },
        })
        .exec();
  
      if (!userDetails) {
        return res.status(404).json({
          success: false,
          message: `Could not find user with id: ${userId}`,
        });
      }
  
      userDetails = userDetails.toObject();
      var SubsectionLength = 0;
  
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0;
        SubsectionLength = 0;
  
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          // Safeguard against undefined values
          const subSections = userDetails.courses[i].courseContent[j].subSection || [];
          totalDurationInSeconds += subSections.reduce((acc, curr) => acc + parseInt(curr.timeDuration || 0), 0);
          userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
          SubsectionLength += subSections.length;
        }
  
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        });
  
        courseProgressCount = courseProgressCount?.completedVideos.length || 0;
  
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100;
        } else {
          const multiplier = Math.pow(10, 2);
          userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier;
        }
      }
  
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }