import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import useApplicationStore from "../stores/apiStores/applicationStore";

const Applications = () => {
  const applications = useApplicationStore((state) => state.applications);
  const loading = useApplicationStore((state) => state.loading);
  const error = useApplicationStore((state) => state.error);
  const applicationDeleted = useApplicationStore(
    (state) => state.applicationDeleted
  );
  const resetApplications = useApplicationStore(
    (state) => state.resetApplications
  );
  const fetchEmployerApplications = useApplicationStore(
    (state) => state.fetchEmployerApplications
  );
  const deleteApplication = useApplicationStore(
    (state) => state.deleteApplication
  );
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetApplications();
    }
  }, [error, resetApplications]);
  useEffect(() => {
    fetchEmployerApplications();
  }, [fetchEmployerApplications]);
  useEffect(() => {
    if (applicationDeleted) {
      toast.success("Application deleted successfully");
      resetApplications();
      fetchEmployerApplications();
    }
  }, [applicationDeleted, fetchEmployerApplications, resetApplications]);

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
        <h1>You have no applications from job seekers.</h1>
      ) : (
        <>
          <div className="account_components">
            <h3>Applications For Your Posted Jobs</h3>
            <div className="applications_container">
              {applications.map((element) => {
                return (
                  <div className="card" key={element._id}>
                    <p className="sub-sec">
                      <span>Job Title: </span> {element.jobInfo.jobTitle}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Name: </span>{" "}
                      {element.jobSeekerInfo.name}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Email:</span>{" "}
                      {element.jobSeekerInfo.email}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Phone: </span>{" "}
                      {element.jobSeekerInfo.phone}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's Address: </span>{" "}
                      {element.jobSeekerInfo.address}
                    </p>
                    <p className="sub-sec">
                      <span>Applicant's CoverLetter: </span>
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
                        Delete Application
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

export default Applications;
