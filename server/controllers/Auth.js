const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile")
const otpgenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require("dotenv").config();

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already registered',
            });
        }

        let otp = otpgenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log(otp);

        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpgenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            console.log(otp);

            result = await OTP.findOne({ otp: otp });
        }

        const otpPayLoad = { email, otp };
        const otpBody = await OTP.create(otpPayLoad);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Some error occurred",
        });
    }
};



exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Password and confirm password do not match",
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered",
            });
        }

        // Find the most recent OTP for the given email (case-insensitive search)
        const recentOtp = await OTP.findOne({ email: email.toLowerCase() })
            .sort({ createdAt: -1 });

        // Debugging log
        console.log("Recent OTP retrieved from DB:", recentOtp);

        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        // Ensure the provided OTP matches the one in the database
        if (otp.trim() !== recentOtp.otp.trim()) {
            return res.status(400).json({
                success: false,
                message: "OTP does not match",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the profile
        const profile = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profile._id,
            image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        });

        return res.status(200).json({
            message: "User is registered successfully",
            success: true,
            user
        });
    } 
    catch (error) {
        // Log the error for debugging
        console.error("Error during user registration:", error);

        return res.status(500).json({
            message: "User is not registered",
            success: false,
            error: error.message  // Return the error message for easier debugging
        });
    }
};




exports.login = async(req,res) => {
    try{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(403).json({
            success:false,
            message:"all fields must be filled"
        });
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(401).json({
            success:false,
            message:"user not registered"
        });
    }

    if(await bcrypt.compare(password,user.password)){
        const payload = {
            email: user.email,
            id: user._id,
            accountType:user.accountType,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn:"2h"
        })
        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true
        }

        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in succesfully"
        })
    }
    else{
        return res.status(401).json({
            success:false,
            message:"password incorrect"
        })
    }
}
catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"error coccured"
    })
}
}
 
exports.changePassword = async(req,res) => {
    try {
        const {oldPassword,newPassword,confirmPassword} = req.body;
    if(newPassword!==confirmPassword){
        return res.json({
            success:false,
            message:"Passwords do not match",
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword,10);
    const user = await User.findById(req.user.id);
    const email = user.email;
    if(bcrypt.compare(oldPassword,user.password)){
        await User.findOneAndUpdate(
            {email:email},
            {password:hashedPassword},
            {new:true},
        );
    }
    else{
        return res.json({
            success:false,
            message:"Old pass is incorrect",
        });
    }
    return res.status(200).json({
        message: "User is registered successfully",
        success: true,
        user
    });
    } catch (error) {
        console.log(error);
    return res.status(500).json({
        success:false,
        message:"error coccured"
    })
    }
}