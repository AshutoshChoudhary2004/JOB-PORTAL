import ErrorHandler from "../middlewares/errors.js";
import { v2 as cloudinary } from "cloudinary";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";

export const postApplication = async (req, res, next) => {
    const { name, email, phone, address, coverLetter } = req.body;
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    if (!name || !email || !phone || !address || !coverLetter) {
        return next(new ErrorHandler("Please Enter all fields"), 400);
    }
    const isAlreadyApplied = await Application.findOne({
        "jobInfo.jobId": jobId,
        "jobSeekerInfo.id": req.user._id,
    });
    if (isAlreadyApplied) {
        return next(new ErrorHandler("You have already applied for this job", 400));
    }
    const jobSeekerInfo = {
        id: req.user._id,
        name,
        email,
        phone,
        address,
        coverLetter,
        role: "Job Seeker"
    }

    if (req.files && req.files.resume) {
        const resume = req.files.resume;
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, {
                folder: "Job_Seekers_Resume"
            }
            );
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                return next(new ErrorHandler("failed to upload results to cloud"), 500);
            }
            jobSeekerInfo.resume = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url
            };

        } catch (error) {
            return next(new ErrorHandler("failed to upload resume to cloud", 500));
        }
    }
    else if (req.user.resume.url) {
        jobSeekerInfo.resume = {
            public_id: req.user.resume.public_id,
            url: req.user.resume.url
        };
    } else {
        return next(new ErrorHandler("Please Upload Resume", 400));
    }

    const employerInfo = {
        id: job.postedBy,
        role: "Employer"
    };

    const jobInfo = {
        jobId,
        jobTitle: job.title
    };

    try {
        const application = await Application.create({ jobSeekerInfo, employerInfo, jobInfo });
        await application.save();
        res.status(201).json({
            success: true,
            message: "Application submitted.",
            application,
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to submit application", 500));
    }

};
export const jobSeekerGetAllApplication = async (req, res, next) => {
    try {
        const applications = await Application.find({
            "jobSeekerInfo.id": req.user._id,
            "deletedBy.jobSeeker": false
        });
        res.status(200).json({
            success: true,
            applications,
            count: applications.length
        });
    } catch (error) {
        next(new ErrorHandler(`Failed to get all aplications of ${req.user._id}`, 500));
    }
};
export const employerGetAllApplication = async (req, res, next) => {
    try {
        const applications = await Application.find({
            "employerInfo.id": req.user._id,
            "deletedBy.employer": false
        });
        res.status(200).json({
            success: true,
            applications,
            count: applications.length
        });
    } catch (error) {
        next(new ErrorHandler(`Failed to get all aplications of ${req.user._id}`, 500));
    }
};
export const deleteApplication = async (req, res, next) => {

    try {

        const application = await Application.findById(req.params.id);
        if (req.user.role == "Job Seeker") {
            application.deletedBy.jobSeeker = true;
        } else application.deletedBy.employer = true;

        await application.save();
        if (application.deletedBy.employer && application.deletedBy.jobSeeker) {
            await Application.findByIdAndDelete(application._id);
        }
        res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });
    } catch(error){
        next(new ErrorHandler("Failed to delete application"), 500);
    }
};