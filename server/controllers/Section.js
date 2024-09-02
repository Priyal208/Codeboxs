const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        // Check for missing fields
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing fields",
            });
        }

        // Create a new section
        const newSection = await Section.create({
            sectionName: sectionName,
        });

        // Update the course with the new section
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true }
        ).populate('courseContent'); // Populate to get the full details if needed

        // Send response with updated course details
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            data: updatedCourseDetails, // Ensure the data key is used
        });
    } catch (error) {
        console.error("Error creating section:", error); // Log error for debugging
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


exports.updateSection = async(req,res) => {
    try {
        const{sectionName,sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.json({
                success:false,
                message:"missing fields"
            })
        }

        const section = await Section.findByIdAndUpdate(sectionId,{sectionName:sectionName},{new:true});

        return res.status(200).json({
            success:true,
            message:"section updated succesfully",
            section
        })

    } catch (error) {
        return res.json({
            success:false,
            message:"soemthing went wrong"
        })
    }
}

exports.deleteSection = async(req,res) => {
    try {
        const {sectionId} = req.params;
        if(!sectionId){
            return res.json({
                success:false,
                message:"missing fields"
            })
        }
        await Section.findByIdAndDelete(sectionId);
        return res.status(200).json({
            success:true,
            message:"section deleted succesfully",
        })
    } catch (error) {
        return res.json({
            success:false,
            message:"soemthing went wrong"
        })
    }
}