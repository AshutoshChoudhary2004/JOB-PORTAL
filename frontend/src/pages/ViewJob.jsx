import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useJobStore from "../stores/apiStores/jobStore";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export const ViewJob = () => {
  const { id } = useParams();
  const job = useJobStore((state) => state.singleJob);
  const fetchSingleJob = useJobStore((state) => state.fetchSingleJob);
  const loading = useJobStore((state) => state.loading);
  const error = useJobStore((state) => state.error);
  const resetJobStoreState = useJobStore((state) => state.resetJobStoreState);

  useEffect(() => {
    fetchSingleJob(id);
  }, [fetchSingleJob, id]);

  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error("Invalid job ID. Please check the URL.", { autoClose: 1500 });
      resetJobStoreState();
      navigate("/jobs");
    }
  }, [error, resetJobStoreState, navigate]);

  return loading ? (
    <Spinner />
  ) : (
    <div className="viewjob-bg">
      <div className="viewjob-main">
        <header className="viewjob-header">
          <h2>{job.title}</h2>
          <div className="viewjob-meta">
            <span className="company">{job.companyName}</span>
            <span className="location">{job.location}</span>
          </div>
        </header>
        <hr />
        <section className="viewjob-section">
          <div className="viewjob-info">
            <div>
              <span className="viewjob-label">Salary:</span>{" "}
              <span className="salary">
                {job.salary ? `₹${job.salary}` : "Not specified"}
              </span>
            </div>
            <div>
              <span className="viewjob-label">Type:</span> {job.jobType}
            </div>
            <div>
              <span className="viewjob-label">Posted:</span>{" "}
              {job.jobPostedOn
                ? new Date(job.jobPostedOn).toLocaleDateString()
                : "N/A"}
            </div>
            <div>
              <span className="viewjob-label">Niche:</span> {job.jobNiche}
            </div>
            <div>
              <span className="viewjob-label">Hiring Multiple Candidates:</span>{" "}
              {job.hiringMultipleCandidates}
            </div>
            {job.personalWebsite?.url && (
              <div>
                <a
                  href={job.personalWebsite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 400 }}
                >
                  Company Website
                </a>
              </div>
            )}
          </div>
          <div className="viewjob-details">
            <div className="viewjob-block">
              <h4>Introduction</h4>
              <p>{job.introduction || "-"}</p>
            </div>
            <div className="viewjob-block">
              <h4>Responsibilities</h4>
              <p>{job.responsibilities}</p>
            </div>
            <div className="viewjob-block">
              <h4>Qualifications</h4>
              <p>{job.qualifications}</p>
            </div>
            {job.offers && (
              <div className="viewjob-block">
                <h4>Offers</h4>
                <p>{job.offers}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewJob;
