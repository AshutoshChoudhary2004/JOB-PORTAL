import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CiCircleInfo } from "react-icons/ci";
import useJobPostFormStore from "../stores/formStores/userJobPostFormStore";
import useJobStore from "../stores/apiStores/jobStore";
import { cities, nichesArray } from "../constants/constants";

const JobPost = () => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    jobNiche,
    salary,
    hiringMultipleCandidates,
    personalWebsiteTitle,
    personalWebsiteUrl,
    setTitle,
    setJobType,
    setLocation,
    setCompanyName,
    setIntroduction,
    setResponsibilities,
    setQualifications,
    setOffers,
    setJobNiche,
    setSalary,
    setHiringMultipleCandidates,
    setPersonalWebsiteTitle,
    setPersonalWebsiteUrl,
  } = useJobPostFormStore();

  const loading = useJobStore((state) => state.loading);
  const error = useJobStore((state) => state.error);
  const jobPosted = useJobStore((state) => state.jobPosted);
  const postJob = useJobStore((state) => state.postJob);
  const resetJobStoreState = useJobStore((state) => state.resetJobStoreState);
  const [confirmPostJob, setConfirmPostJob] = useState(null);

  const handlePostJob = () => {
    const formData = {
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsibilities,
      qualifications,
      jobNiche,
      salary,
    };

    if (offers) formData.offers = offers;
    if (hiringMultipleCandidates)
      formData.hiringMultipleCandidates = hiringMultipleCandidates;
    if (personalWebsiteTitle)
      formData.personalWebsiteTitle = personalWebsiteTitle;
    if (personalWebsiteUrl) formData.personalWebsiteUrl = personalWebsiteUrl;

    setConfirmPostJob(formData);
  };

  const handleConfirmPostJob = () => {
    if (confirmPostJob) {
      postJob(confirmPostJob);
      setConfirmPostJob(null);
    }
  };

  const handleCancelPostJob = () => {
    setConfirmPostJob(null);
  };

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error, { autoClose: 1500 });
      resetJobStoreState();
    }
  }, [resetJobStoreState, error]);

  const navigate = useNavigate();

  useEffect(() => {
    if (jobPosted) {
      toast.dismiss();
      toast.success("Job Posted Successfully", { autoClose: 1500 });
      resetJobStoreState();
      navigate("/dashboard/my-jobs");
    }
  }, [resetJobStoreState, jobPosted, navigate]);

  return (
    <>
      {confirmPostJob && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h2>Confirm Job Posting</h2>
            <p>Are you sure you want to post this job?</p>
            <button onClick={handleConfirmPostJob}>Yes, Post Job</button>
            <button onClick={handleCancelPostJob}>Cancel</button>
          </div>
        </div>
      )}
      <div className="account_components">
        <h3>Post A Job</h3>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job Title"
          />
        </div>
        <div>
          <label>Job Type</label>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>
        <div>
          <label>Location (City)</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select Job Type</option>
            {cities.map((element) => {
              return (
                <option key={element} value={element}>
                  {element}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
          />
        </div>
        <div>
          <label>Company/Job Introduction</label>
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            placeholder="Company / Job Introduction"
            rows={7}
          />
        </div>
        <div>
          <label>Responsibilities</label>
          <textarea
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            placeholder="Job Responsibilities"
            rows={7}
          />
        </div>
        <div>
          <label>Qualifications</label>
          <textarea
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            placeholder="Required Qualifications For Job"
            rows={7}
          />
        </div>
        <div>
          <div className="label-infoTag-wrapper">
            <label>What We Offer</label>
            <span>
              <CiCircleInfo /> Optional
            </span>
          </div>
          <textarea
            value={offers}
            onChange={(e) => setOffers(e.target.value)}
            placeholder="What are we offering in return!"
            rows={7}
          />
        </div>
        <div>
          <label>Job Niche</label>
          <select
            value={jobNiche}
            onChange={(e) => setJobNiche(e.target.value)}
          >
            <option value="">Select Job Niche</option>
            {nichesArray.map((element) => {
              return (
                <option key={element} value={element}>
                  {element}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Salary</label>
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="50000 - 800000"
          />
        </div>
        <div>
          <div className="label-infoTag-wrapper">
            <label>Hiring Multiple Candidates?</label>
            <span>
              <CiCircleInfo /> Optional
            </span>
          </div>
          <select
            value={hiringMultipleCandidates}
            onChange={(e) => setHiringMultipleCandidates(e.target.value)}
          >
            <option value="">Hiring Multiple Candidates?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <div className="label-infoTag-wrapper">
            <label>Personal Website Name</label>
            <span>
              <CiCircleInfo /> Optional
            </span>
          </div>
          <input
            type="text"
            value={personalWebsiteTitle}
            onChange={(e) => setPersonalWebsiteTitle(e.target.value)}
            placeholder="Peronsal Website Name/Title"
          />
        </div>
        <div>
          <div className="label-infoTag-wrapper">
            <label>Personal Website Link (URL)</label>
            <span>
              <CiCircleInfo /> Optional
            </span>
          </div>
          <input
            type="text"
            value={personalWebsiteUrl}
            onChange={(e) => setPersonalWebsiteUrl(e.target.value)}
            placeholder="Peronsal Website Link (URL)"
          />
        </div>
        <div>
          <button
            style={{ margin: "0 auto" }}
            className="btn"
            onClick={handlePostJob}
            disabled={loading}
          >
            Post Job
          </button>
        </div>
      </div>
    </>
  );
};

export default JobPost;
