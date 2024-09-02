const User = require('../models/User');
const mailSender = require('../utils/mailSender')
const crypto = require('crypto');
const bcrypt = require('bcrypt')


exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Your email is not registered"
            });
        }

        const token = crypto.randomUUID(); // or alternative method
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
            { new: true }
        );

        const url = `http://localhost:3000/update-password/${token}`;
        await mailSender(email, "Password reset Link", `Password reset Link: ${url}`);

        return res.status(200).json({
            success: true,
            message: "Mail sent successfully, please check!"
        });

    } catch (error) {
        console.error("Error in resetPasswordToken:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};




exports.resetPassword = async(req,res) =>{
    try{const {password,confirmPassword,token} = req.body;
    if(password!=confirmPassword){
        return res.json({
            sucess:false,
            message:"passwords do not match"
        });
    }

    const userDetails = await User.findOne({token:token});
    if(!userDetails){
        return res.json({
            sucess:false,
            message:"token invalid"
        })
    }

    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            sucess:false,
            message:"Token expired"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    );
    
    return res.json({
        sucess:true,
        message:"password reset sucesfully"
    })
}
catch(error){
    console.log(error);
    return res.json({
        sucess:false,
        message:"something went wrong"
    })
}
}