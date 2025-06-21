import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LuMoveRight } from "react-icons/lu";
import useUserStore from "../stores/apiStores/userStore";
import useUserUpdateFormStore from "../stores/formStores/userUpdateFormStore";
import useJobPostFormStore from "../stores/formStores/userJobPostFormStore";

const Dashboard = () => {
  const [show, setShow] = useState(false);

  const user = useUserStore((state) => state.user);
  const error = useUserStore((state) => state.error);
  const clearAllUserErrors = useUserStore((state) => state.clearAllUserErrors);

  const navigateTo = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigateTo("/");
    toast.dismiss();
    toast.success("Logged out successfully.", { autoClose: 1500 });
  };
  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error, { autoClose: 1500 });
      clearAllUserErrors();
    }
  }, [error, clearAllUserErrors]);

  return (
    <>
      <section className="account">
        <div className="component_header">
          <p>Dashboard</p>
          <p>
            Welcome! <span>{user && user.name}</span>
          </p>
        </div>
        <div className="container">
          <div className={show ? "sidebar showSidebar" : "sidebar"}>
            <ul className="sidebar_links">
              <h4>Manage Account</h4>
              <li>
                <button
                    className="sidebar_link"
                    onClick={() => {
                      setShow(!show);
                      useJobPostFormStore.getState().resetJobPostForm();
                      navigateTo("/dashboard/my-profile");
                    }}
                  >
                    My Profile
                  </button>
              </li>
              <li>
                <button
                  className="sidebar_link"
                  onClick={() => {
                    setShow(!show);
                    useUserUpdateFormStore.getState().resetUserUpdateForm();
                    navigateTo("/dashboard/update-profile");
                  }}
                >
                  Update Profile
                </button>
              </li>
              <li>
                <button
                    className="sidebar_link"
                    onClick={() => {
                      setShow(!show);
                      useJobPostFormStore.getState().resetJobPostForm();
                      navigateTo("/dashboard/update-password");
                    }}
                  >
                  Update Password
                  </button>
              </li>
              {user.role == "Employer" && (
                <li>
                  <Link className="sidebar_link" to={`/dashboard/my-jobs`}>
                    My Jobs
                  </Link>
                </li>
              )}
              {user.role == "Employer" && (
                <li>
                  <button
                    className="sidebar_link"
                    onClick={() => {
                      setShow(!show);
                      useJobPostFormStore.getState().resetJobPostForm();
                      navigateTo("/dashboard/job-post");
                    }}
                  >
                    Post New Job
                  </button>
                </li>
              )}
              {user.role == "Employer" && (
                <li>
                  <button
                    className="sidebar_link"
                    onClick={() => {
                      setShow(!show);
                      useJobPostFormStore.getState().resetJobPostForm();
                      navigateTo("/dashboard/applications");
                    }}
                  >
                    Applications
                  </button>
                </li>
              )}
              {user.role == "Job Seeker" && (
                <li>
                  <button
                    className="sidebar_link"
                    onClick={() => {
                      setShow(!show);
                      useJobPostFormStore.getState().resetJobPostForm();
                      navigateTo("/dashboard/my-applications");
                    }}
                  >
                    My Applications
                  </button>
                </li>
              )}
              <li>
                <button className="sidebar_link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
          <div className="banner" style={{ height: "100vh" }}>
            <div
              className={
                show ? "sidebar_icon move_right" : "sidebar_icon move_left"
              }
            >
              <LuMoveRight
                onClick={() => setShow(!show)}
                className={show ? "left_arrow" : "right_arrow"}
              />
            </div>
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
