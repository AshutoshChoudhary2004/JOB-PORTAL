import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import useApplicationStore from "../stores/apiStores/applicationStore";

const JobSeekerApplications = () => {
  const resetApplications = useApplicationStore(
    (state) => state.resetApplications
  );

  const loading = useApplicationStore((state) => state.loading);
  const error = useApplicationStore((state) => state.error);
  const applications = useApplicationStore((state) => state.applications);
  const applicationDeleted = useApplicationStore(
    (state) => state.applicationDeleted
  );
  const fetchJobSeekerApplications = useApplicationStore(
    (state) => state.fetchJobSeekerApplications
  );
  const deleteApplication = useApplicationStore(
    (state) => state.deleteApplication
  );
  const [confirmId, setConfirmId] = useState(false);

  useEffect(() => {
    fetchJobSeekerApplications();
  }, [fetchJobSeekerApplications]);

  useEffect(() => {
    if (applicationDeleted) {
      toast.success("Application deleted successfully");
      resetApplications();
      fetchJobSeekerApplications();
    }
  }, [
    error,
    resetApplications,
    applicationDeleted,
    fetchJobSeekerApplications,
  ]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetApplications();
    }
  }, [error, resetApplications]);

  const handleDeleteApplication = (id) => {
    setConfirmId(id);
  };
  const handleConfirmDelete = () => {
    if (confirmId) {
      deleteApplication(confirmId);
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
            <p>Are you sure you want to delete this application?</p>
            <button onClick={handleConfirmDelete}>Yes, Delete</button>
            <button onClick={handleCancelDelete}>Cancel</button>
          </div>
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not applied for any job.
        </h1>
      ) : (
        <>
          <div className="account_components">
            <h3>My Application For Jobs</h3>
            <div className="applications_container">
              {applications.map((element) => {
                return (
                  <div className="card" key={element._id}>
                    <p className="sub-sec">
                      <span>Job Title: </span> {element.jobInfo.jobTitle}
                    </p>
                    <p className="sub-sec">
                      <span>Name</span> {element.jobSeekerInfo.name}
                    </p>
                    <p className="sub-sec">
                      <span>Email</span> {element.jobSeekerInfo.email}
                    </p>
                    <p className="sub-sec">
                      <span>Phone: </span> {element.jobSeekerInfo.phone}
                    </p>
                    <p className="sub-sec">
                      <span>Address: </span> {element.jobSeekerInfo.address}
                    </p>
                    <p className="sub-sec">
                      <span>Coverletter: </span>
                      <textarea
                        value={element.jobSeekerInfo.coverLetter}
                        rows={5}
                        disabled
                      ></textarea>
                    </p>
                    <div className="btn-wrapper">
                      <button
                        className="btn"
                        onClick={() => handleDeleteApplication(element._id)}
                      >
                        Delete Application For Me
                      </button>
                      <Link
                        to={
                          element.jobSeekerInfo &&
                          element.jobSeekerInfo.resume.url
                        }
                        className="btn"
                        target="_blank"
                      >
                        View Resume
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default JobSeekerApplications;
