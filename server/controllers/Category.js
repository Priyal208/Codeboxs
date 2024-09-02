const Category = require('../models/Category');
const Course = require('../models/Course')
exports.createCategory = async(req,res) => {
    try {
        const {name,description} = req.body;
        if(!name || !description){
            return res.json({
                success:false,
                message:"all fields r reqd"
            })
        }

        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });

        return res.status(200).json({
            success:true,
            message:"category created"
        })
    } catch (error) {
        return res.json({
            success:false,
            message:"soemthing went wrong"
        })
    }
}

exports.showAllCategories = async(req,res) => {
    try {
        const allCategories = await Category.find({},{name:true, description:true});
        return res.status(200).json({
            success:true,
            message:"categories fetched succesfully",
            data:allCategories
        })
    } catch (error) {
        return res.json({
            success:false,
            message:"soemthing went wrong"
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required"
            });
        }

        const selectedCategory = await Category.findById(categoryId)
            .populate("course")
            .exec();

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "No courses for the given category"
            });
        }

        const differentCategory = await Category.find({
            _id: { $ne: categoryId },
        })
            .populate("course")
            .exec();
            if (!differentCategory) {
                return res.status(404).json({
                    success: false,
                    message: "No courses for the different  category"
                });
            }

        const topSelling = await Course.find({}).sort({ studentEnrolled: -1 });

        return res.status(200).json({
            success: true,
            message: "Category page details fetched successfully",
            data: {
                selectedCategory,
                differentCategory,
                topSelling,
            },
        });
    } catch (error) {
        console.error("Error fetching category page details:", error); // Log the detailed error
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}


