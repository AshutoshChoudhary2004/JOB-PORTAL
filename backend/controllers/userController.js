import mongoose from "mongoose";
import ErrorHandler from "../middlewares/errors.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";
export const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            password,
            role,
            firstNiche,
            secondNiche,
            thirdNiche,
            coverLetter,
        } = req.body;
        if (!name || !email || !phone || !address || !role) {
            return next(new ErrorHandler("All fields are required", 400));
        }
        if (role == "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
            return next(new ErrorHandler("Please provide your preferred job niches"), 400);
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return next(new ErrorHandler("Email is already registered", 409));
        }
        const userData = {
            name,
            email,
            phone,
            address,
            password,
            role,
            niches: {

                firstNiche,
                secondNiche,
                thirdNiche,
            },
            coverLetter,
        }
        if (req.files && req.files.resume) {
            const { resume } = req.files;
            if (resume) {
                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(
                        resume.tempFilePath,
                        { folder: "Job_Seekers_Resume" });
                    if (!cloudinaryResponse || cloudinaryResponse.error) {
                        return next(new ErrorHandler("failed to upload results to cloud", 500));
                    }
                    userData.resume = {
                        public_id: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.secure_url
                    }
                } catch (error) {
                    return next(new ErrorHandler("Failed to upload resume", 500));
                }
            }
        }
        const user = await User.create(userData);
        sendToken(user, 201, res, "User Registered");
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

export const login = async (req, res, next) => {
    const {role, email, password } = req.body;
    if (!role) {
        return next(new ErrorHandler("Please provide your role", 400));
    }
    if (!email) {
        return next(new ErrorHandler("Please provide your email", 400));
    }
    if (!password) {
        return next(new ErrorHandler("Please provide your password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password"), 400);
    }
    const roleMatched = user.role === role;
    if (!roleMatched) {
        return next(new ErrorHandler("Invalid Email or Password"), 400);
    }
    const passwordMatched = await user.comparePassword(password);
    if (!passwordMatched) {
        return next(new ErrorHandler("Invalid Email or Password"), 400);
    }
    sendToken(user, 200, res, "User Logged in susccessfully");
};

export const logout = (req, res, next) => {
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true
    }
    res.status(200).cookie("token", "", options).json({
        success: true,
        message: "Logged out successfully"
    });
};

export const getUser = (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    });
}

export const updateProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.name = req.body.name;
  user.email = req.body.email;
  user.phone = req.body.phone;
  user.address = req.body.address;
  user.coverLetter = req.body.coverLetter;
  user.niches = {
    firstNiche: req.body.firstNiche,
    secondNiche: req.body.secondNiche,
    thirdNiche: req.body.thirdNiche,
  };

  console.log("phone", user.phone);

  const { firstNiche, secondNiche, thirdNiche } = user.niches;
  if (
    user.role === "Job Seeker" &&
    (!firstNiche || !secondNiche || !thirdNiche)
  ) {
    return next(
      new ErrorHandler("Please provide your all preferred job niches.", 400)
    );
  }

  if (req.files) {
    const resume = req.files.resume;
    if (resume) {
      const currentResumeId = user.resume.public_id;
      if (currentResumeId) {
        await cloudinary.uploader.destroy(currentResumeId);
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job_Seekers_Resume",
      });
      user.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    user,
    message: "Profile updated.",
  });
};

export const updatePassword = async (req, res, next) => {
    const user = await User.findOne({_id: req.user.id}).select("+password");
    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatch){
        return next(new ErrorHandler("Old password is incorrect"), 400);
    }
    if (!req.body.newPassword){
        return next(new ErrorHandler("Please provide a new password"), 400);
    } 
    if (req.body.newPassword.length < 8){
        return next(new ErrorHandler("New password must be at least 8 characters long"), 400);
    }
    if (req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("New Password and confirm password do not match"), 400);
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res, "Password updated successfully");
};