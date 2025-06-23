import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdCash } from "react-icons/io";
import { FaToolbox } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import useJobStore from "../stores/apiStores/jobStore";
import useApplicationStore from "../stores/apiStores/applicationStore";
import useUserApplicationFormStore from "../stores/formStores/userApplicationFormStore";

const PostApplication = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const singleJob = useJobStore((state) => state.singleJob);
  const fetchSingleJob = useJobStore((state) => state.fetchSingleJob);
  const loading = useApplicationStore((state) => state.loading);
  const applicationError = useApplicationStore((state) => state.error);
  const success = useApplicationStore((state) => state.success); // <-- get success
  const postApplication = useApplicationStore((state) => state.postApplication);
  const resetApplications = useApplicationStore(
    (state) => state.resetApplications
  );
  const { jobId } = useParams();

  const {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    address,
    setAddress,
    coverLetter,
    setCoverLetter,
    resume,
    setResume,
  } = useUserApplicationFormStore();

  const jobError = useJobStore((state) => state.error);
  const resetJobStoreState = useJobStore((state) => state.resetJobStoreState);
  const navigate = useNavigate();

  const handlePostApplication = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    if (resume) {
      formData.append("resume", resume);
    }
    postApplication(formData, jobId);
  };

  useEffect(() => {
    fetchSingleJob(jobId);
  }, [fetchSingleJob, jobId]);

  useEffect(() => {
    if (success) {
      toast.dismiss();
      toast.success("Application submitted successfully!", { autoClose: 1500 });
      navigate("/jobs");
      resetApplications();
    }
  }, [success, resetApplications, navigate]);

  useEffect(() => {
    if (jobError) {
      toast.dismiss();
      toast.error("Invalid job ID. Please check the URL.", { autoClose: 1500 });
      resetJobStoreState();
      navigate("/jobs");
    }
  }, [jobError, resetJobStoreState, navigate]);

  useEffect(() => {
    if (applicationError) {
      toast.dismiss();
      if (applicationError === "You have already applied for this job") {
        toast.error(applicationError, { autoClose: 1500 });
        navigate("/jobs");
      } else toast.error(applicationError, { autoClose: 1500 });
    }
    resetApplications();
  }, [applicationError, resetApplications, navigate]);

  let qualifications = [];
  let responsibilities = [];
  let offering = [];
  if (singleJob.qualifications) {
    qualifications = singleJob.qualifications.split(". ");
  }
  if (singleJob.responsibilities) {
    responsibilities = singleJob.responsibilities.split(". ");
  }
  if (singleJob.offers) {
    offering = singleJob.offers.split(". ");
  }

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  return (
    <>
      <article className="application_page">
        <form>
          <h3>Application Form</h3>
          <div>
            <label>Job Title</label>
            <input type="text" placeholder={singleJob.title} disabled />
          </div>
          <div>
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <>
            <div>
              <label>Coverletter</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={10}
              />
            </div>
            <div>
              <label>Resume</label>
              <input type="file" onChange={resumeHandler} accept=".pdf"/>
              <p className="resume-info">
                If you do not upload a resume, the resume from your profile will
                be used.
              </p>
            </div>
          </>

          <div style={{ alignItems: "flex-end" }}>
            <button
              className="btn"
              onClick={handlePostApplication}
              disabled={loading}
            >
              Apply
            </button>
          </div>
        </form>

        <div className="job-details">
          <header>
            <h3>{singleJob.title}</h3>
            {singleJob.personalWebsite && (
              <Link target="_blank" to={singleJob.personalWebsite.url}>
                {singleJob.personalWebsite.title}
              </Link>
            )}
            <p>{singleJob.location}</p>
            <p>Rs. {singleJob.salary} a month</p>
          </header>
          <hr />
          <section>
            <div className="wrapper">
              <h3>Job details</h3>
              <div>
                <IoMdCash />
                <div>
                  <span>Pay</span>
                  <span>{singleJob.salary} a month</span>
                </div>
              </div>
              <div>
                <FaToolbox />
                <div>
                  <span>Job type</span>
                  <span>{singleJob.jobType}</span>
                </div>
              </div>
            </div>
            <hr />
            <div className="wrapper">
              <h3>Location</h3>
              <div className="location-wrapper">
                <FaLocationDot />
                <span>{singleJob.location}</span>
              </div>
            </div>
            <hr />
            <div className="wrapper">
              <h3>Full Job Description</h3>
              <p>{singleJob.introduction}</p>
              {singleJob.qualifications && (
                <div>
                  <h4>Qualifications</h4>
                  <ul>
                    {qualifications.map((element) => {
                      return (
                        <li key={element} style={{ listStyle: "inside" }}>
                          {element}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {singleJob.responsibilities && (
                <div>
                  <h4>Responsibilities</h4>
                  <ul>
                    {responsibilities.map((element) => {
                      return (
                        <li key={element} style={{ listStyle: "inside" }}>
                          {element}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {singleJob.offers && (
                <div>
                  <h4>Offering</h4>
                  <ul>
                    {offering.map((element) => {
                      return (
                        <li key={element} style={{ listStyle: "inside" }}>
                          {element}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </section>
          <hr />
          <footer>
            <h3>Job Niche</h3>
            <p>{singleJob.jobNiche}</p>
          </footer>
        </div>
      </article>
    </>
  );
};

export default PostApplication;
