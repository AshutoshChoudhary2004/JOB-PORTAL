import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { cities, nichesArray } from "../constants/constants.js";
import useJobStore from "../stores/apiStores/jobStore.js";
import useUserStore from "../stores/apiStores/userStore.js";
import useUserApplicationFormStore from "../stores/formStores/userApplicationFormStore.js";
const Jobs = () => {
  const [filters, setFilters] = useState({
    city: "",
    niche: "",
    searchKeyword: "",
  });

  const [showSpinner, setShowSpinner] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [applyCooldown, setApplyCooldown] = useState(false);

  const jobs = useJobStore((state) => state.jobs);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const resetJobStoreState = useJobStore((state) => state.resetJobStoreState);
  const loading = useJobStore((state) => state.loading);
  const error = useJobStore((state) => state.error);

  const user = useUserStore((state) => state.user);
  const role = user.role;

  useEffect(() => {
    if (error) {
      console.log("error");
      toast.dismiss();
      toast.error(error, { autoClose: 1500 });
      resetJobStoreState();
    }
  }, [error, resetJobStoreState]);

  useEffect(() => {
    fetchJobs(filters.city, filters.niche);
  }, [filters.city, filters.niche, fetchJobs]);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowSpinner(true), 400); // Show spinner only if loading > 400ms
    } else {
      setShowSpinner(false);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [loading]);

  useEffect(() => {
    let timer;
    if (jobs && jobs.length === 0) {
      timer = setTimeout(() => setShowNotFound(true), 400); // Show not found image only if loading is false and jobs array is empty
    } else {
      setShowNotFound(false);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [jobs]);

  const handleCityChange = (e) => {
    setFilters((prev) => ({ ...prev, city: e.target.value }));
  };

  const handleNicheChange = (e) => {
    setFilters((prev) => ({ ...prev, niche: e.target.value }));
  };

  const handleKeywordChange = (e) => {
    setFilters((prev) => ({ ...prev, searchKeyword: e.target.value }));
  };

  const handleSearch = () => {
    setIsButtonClicked(true);
    fetchJobs(filters.city, filters.niche, filters.searchKeyword);
    setTimeout(() => setIsButtonClicked(false), 200); // Animation duration
  };
  const navigate = useNavigate();
  const resetUserApplicationForm = useUserApplicationFormStore(
    (state) => state.resetUserApplicationForm
  );
  const handleApplyClick = (id) => {
    if (applyCooldown) return;
    if (role != "Job Seeker") {
      toast.error("Please Login First", { autoClose: 2000 });
      setApplyCooldown(true);
      setTimeout(() => setApplyCooldown(false), 2500); 
    } else {
      resetUserApplicationForm();
      navigate(`/post/application/${id}`);
    }
  };

  return (
    <>
      {showSpinner ? (
        <Spinner />
      ) : (
        <section className="jobs">
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={filters.searchKeyword}
              onChange={handleKeywordChange}
            />
            <button
              className={`find-job-btn${isButtonClicked ? " clicked" : ""}`}
              onClick={handleSearch}
            >
              Find Job
            </button>
            <FaSearch />
          </div>
          <div className="wrapper">
            <div className="filter-bar">
              <div className="cities">
                <h2>Filter Job By City</h2>
                {cities.map((city, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={city}
                      name="city"
                      value={city}
                      checked={filters.city === city}
                      onChange={handleCityChange}
                    />
                    <label htmlFor={city}>{city}</label>
                  </div>
                ))}
              </div>
              <div className="cities">
                <h2>Filter Job By Niche</h2>
                {nichesArray.map((niche, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={niche}
                      name="niche"
                      value={niche}
                      checked={filters.niche === niche}
                      onChange={handleNicheChange}
                    />
                    <label htmlFor={niche}>{niche}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="container">
              <div className="mobile-filter">
                <select value={filters.city} onChange={handleCityChange}>
                  <option value="">Filter By City</option>
                  {cities.map((city, index) => (
                    <option value={city} key={index}>
                      {city}
                    </option>
                  ))}
                </select>
                <select value={filters.niche} onChange={handleNicheChange}>
                  <option value="">Filter By Niche</option>
                  {nichesArray.map((niche, index) => (
                    <option value={niche} key={index}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>
              <div className="jobs_container">
                {jobs && jobs.length > 0
                  ? jobs.map((element) => {
                      return (
                        <div className="card" key={element._id}>
                          {element.hiringMultipleCandidates === "Yes" ? (
                            <p className="hiring-multiple">
                              Hiring Multiple Candidates
                            </p>
                          ) : (
                            <p className="hiring">Hiring</p>
                          )}
                          <p className="title">{element.title}</p>
                          <p className="company">{element.companyName}</p>
                          <p className="location">{element.location}</p>
                          <p className="salary">
                            <span>Salary:</span> Rs. {element.salary}
                          </p>
                          <p className="posted">
                            <span>Posted On:</span>{" "}
                            {element.jobPostedOn.substring(0, 10)}
                          </p>

                          {role === "Employer" ? (
                            <div className="btn-wrapper">
                              <Link className="btn" to={`/job/${element._id}`}>
                                View Details
                              </Link>
                            </div>
                          ) : (
                            <div className="btn-wrapper">
                              <button
                                className="btn"
                                onClick={() => handleApplyClick(element._id)}
                              >
                                Apply Now
                              </button>
                            </div>
                            // <div className="btn-wrapper">
                            //   <Link
                            //     className="btn"
                            //     to={`/post/application/${element._id}`}
                            //   >
                            //     Apply Now
                            //   </Link>
                            // </div>
                          )}
                        </div>
                      );
                    })
                  : showNotFound && (
                      <div className="job-not-found-message">
                        <span role="img" aria-label="not-found">
                          🔎
                        </span>
                        Job Not Found
                      </div>
                    )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;
