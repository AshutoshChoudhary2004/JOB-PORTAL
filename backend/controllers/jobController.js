import ErrorHandler from "../middlewares/errors.js";
import { Job } from "../models/jobSchema.js";

export const postJob = async (req, res, next) => {
    const {
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsiteTitle,
        personalWebsiteUrl,
        jobNiche,
    } = req.body;
    if (
        !title ||
        !jobType ||
        !location ||
        !companyName ||
        !introduction ||
        !responsibilities ||
        !qualifications ||
        !salary ||
        !jobNiche
    ) {
        return next(new ErrorHandler("Please provide full job details.", 400));
    }
    if (
        (personalWebsiteTitle && !personalWebsiteUrl) ||
        (!personalWebsiteTitle && personalWebsiteUrl)
    ) {
        return next(
            new ErrorHandler(
                "Provide both the website url and title, or leave both blank.",
                400
            )
        );
    }
    const postedBy = req.user._id;
    const job = await Job.create({
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsite: {
            title: personalWebsiteTitle,
            url: personalWebsiteUrl,
        },
        jobNiche,
        postedBy,
    });
    res.status(201).json({
        success: true,
        message: "Job posted successfully.",
        job,
    });
};

export const getAllJobs = async (req, res, next) => {
    const { city, niche, searchKeyword } = req.query;
    const query = {};
    if (city) {
        query.location = city;
    }
    if (niche) {
        query.jobNiche = niche;
    }
    if (searchKeyword) {
        query.$or = [
            { title: { $regex: searchKeyword, $options: "i" } },
            { companyName: { $regex: searchKeyword, $options: "i" } },
            { introduction: { $regex: searchKeyword, $options: "i" } },
        ]
    }
    const jobs = await Job.find(query);
    res.status(200).json({
        success: true,
        jobs,
        count: jobs.length
    });
};
export const getMyJobs = async (req, res, next) => {
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
        success: true,
        myJobs,
        count : myJobs.length
    });
};
export const getASingleJob = async (req, res, next) => {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job){
        return next(new ErrorHandler("job not found", 404));
    }
    res.status(200).json({
        success : true,
        job
    });
};
export const deleteJob = async (req, res, next) => {
    const jobId = req.params.id;
    const result = await Job.findByIdAndDelete(jobId);

    if (!result){
        return next(new ErrorHandler("Oops job not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "job deleted successfully"
    });
};