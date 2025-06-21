import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import useJobStore from "../stores/apiStores/jobStore";

const MyJobs = () => {
  const [confirmId, setConfirmId] = useState(null);

  const loading = useJobStore((state) => state.loading);
  const error = useJobStore((state) => state.error);
  const myJobs = useJobStore((state) => state.myJobs);
  const deleteJob = useJobStore((state) => state.deleteJob);
  const jobDeleted = useJobStore((state) => state.jobDeleted);
  const getMyJobs = useJobStore((state) => state.getMyJobs);
  const resetJobStoreState = useJobStore((state) => state.resetJobStoreState);
  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error, { autoClose: 1500 });
      resetJobStoreState();
    }
  }, [error, resetJobStoreState]);

  useEffect(() => {
    getMyJobs();
  }, [getMyJobs]);

  useEffect(() => {
    if (jobDeleted) {
      toast.dismiss();
      toast.success("Job deleted successfully", { autoClose: 1500 });
      getMyJobs();
      resetJobStoreState();
    }
  }, [error, resetJobStoreState, jobDeleted, getMyJobs]);

  const handleDeleteJob = (id) => {
    setConfirmId(id);
  };
  const handleConfirmDelete = () => {
    if (confirmId) {
      deleteJob(confirmId);
      setConfirmId(null);
    }
  };
  const handleCancelDelete = () => {
    setConfirmId(null);
  };

  return (
    <>
      {confirmId && (
        <div className="confirm-dialog">
          <div className="confirm-dialog-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this job?</p>
            <button onClick={handleConfirmDelete}>Yes, Delete</button>
            <button onClick={handleCancelDelete}>Cancel</button>
          </div>
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : myJobs && myJobs.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not posted any job!
        </h1>
      ) : (
        <>
          <div className="account_components">
            <h3>My Jobs</h3>
            <div className="applications_container">
              {myJobs.map((element) => (
                <div className="card" key={element._id}>
                  <p className="sub-sec">
                    <span>Job Title: </span>
                    {element.title}
                  </p>
                  <p className="sub-sec">
                    <span>Job Niche:</span> {element.jobNiche}
                  </p>
                  <p className="sub-sec">
                    <span>Salary: </span> {element.salary}
                  </p>
                  <p className="sub-sec">
                    <span>Location:</span> {element.location}
                  </p>
                  <p className="sub-sec">
                    <span>Job Type:</span> {element.jobType}
                  </p>
                  <p className="sub-sec">
                    <span>Company Name:</span> {element.companyName}
                  </p>
                  <p className="sub-sec">
                    <span>Introduction:</span> {element.introduction}
                  </p>
                  <p className="sub-sec">
                    <span>Qualifications:</span> {element.qualifications}
                  </p>
                  <p className="sub-sec">
                    <span>Responsibilities:</span> {element.responsibilities}
                  </p>
                  {element.offers && (
                    <p className="sub-sec">
                      <span>What Are We Offering:</span> {element.offers}
                    </p>
                  )}
                  <button
                    className="btn"
                    onClick={() => handleDeleteJob(element._id)}
                  >
                    Delete Job
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyJobs;
