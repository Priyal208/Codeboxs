const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const { response } = require('express');

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorisation")?.replace("Bearer ", "").trim();

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            console.error("JWT verification error:", error.message);
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


exports.isAdmin = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                sucess: false,
                message: "This is protected route for admin"
            });
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            sucess: false,
            message: "error"
        });
    }
}

exports.isStudent = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                sucess: false,
                message: "This is protected route for student"
            });
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            sucess: false,
            message: "error"
        });
    }
}

exports.isInstructor = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                sucess: false,
                message: "This is protected route for instructor"
            });
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            sucess: false,
            message: "error"
        });
    }
}
