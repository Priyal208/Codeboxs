const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const videoFile = req.files.video;
    if (!sectionId || !title || !description || !videoFile) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(videoFile, process.env.FOLDER_NAME);
    if (!uploadDetails || !uploadDetails.secure_url) {
      return res.status(501).json({
        success: false,
        message: "Failed to upload video",
      });
    }

    // Create the SubSection
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration: `${uploadDetails.duration}`,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update the Section with the new SubSection
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { SubSection: subSectionDetails._id } },
      { new: true }
    ).populate("SubSection").exec();

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      }); 
    }

    return res.status(200).json({
      success: true,
      message: "Sub-section created successfully",
      updatedSection,
    });
  } catch (error) {
    console.error("Error creating sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
  

exports.updateSubSection = async(req,res) => {
    try {
        const {SubSectionName, SubSectionId} = req.body;
        if(!SubSectionName || !SubSectionId){
            return res.json({
                success:false,
                message:"missing fields"
            })
        }

        const SubSection = await SubSection.findByIdAndUpdate({SubSectionId},{title:SubSectionName},{new:true});

        return res.status(200).json({
            success:true,
            message:"sub-section updated succesfully",
            updatedCourseDetails
        })
    } catch (error) {
        return res.json({
            success:false,
            message:"soemthing went wrong"
        })
    }
}

exports.deleteSubSection = async(req,res) => {
    try {
        const {subsectionId} = req.body;
        if(!subsectionId){
            return res.json({
                success:false,
                message:"missing fields"
            })
        }

        await SubSection.findByIdAndDelete(subsectionId);

        return res.status(200).json({
            success:true,
            message:"sub-section deleted succesfully",
            updatedCourseDetails
        })
    } catch (error) {
        return res.json({
            success:false,
            message:"soemthing went wrong"
        })
    }
}