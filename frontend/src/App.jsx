import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PostApplication from "./pages/PostApplication";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import useUserStore from "./stores/apiStores/userStore";
import { ViewJob } from "./pages/ViewJob";
import MyProfile from "./components/MyProfile";
import UpdateProfile from "./components/UpdateProfile";
import UpdatePassword from "./components/UpdatePassword";
import MyJobs from "./components/MyJobs";
import JobPost from "./components/JobPost";
import Applications from "./components/EmployerApplications";
import MyApplications from "./components/JobSeekerApplications";
import PrivateRoute from "./pages/PrivateRoute";
import AuthorizeRoute from "./pages/AuthorizeRoute";

const App = () => {
  const checkAuthentication = useUserStore(
    (state) => state.checkAuthentication
  );
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="update-password" element={<UpdatePassword />} />
            <Route element={<AuthorizeRoute userRole="Job Seeker" />}>
              <Route path="my-applications" element={<MyApplications />} />
            </Route>
            <Route element={<AuthorizeRoute userRole="Employer" />}>
              <Route path="job-post" element={<JobPost />} />
              <Route path="applications" element={<Applications />} />
              <Route path="my-jobs" element={<MyJobs />} />
            </Route>
          </Route>
        </Route>
        <Route path="/post/application/:jobId" element={<PostApplication />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/job/:id" element={<ViewJob />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" theme="dark" />
    </>
  );
};

export default App;
