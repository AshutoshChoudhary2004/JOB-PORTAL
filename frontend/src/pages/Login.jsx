import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import useUserStore from "../stores/apiStores/userStore";

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loading = useUserStore((state) => state.loading);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const error = useUserStore((state) => state.error);
  const clearAllUserErrors = useUserStore((state) => state.clearAllUserErrors);
  const login = useUserStore((state) => state.login);

  const navigateTo = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("role", role);
    formData.append("email", email);
    formData.append("password", password);
    login(formData);
  };
  
  useEffect(() => {
    if (error && error !== "Please login to access this resource") {
      clearAllUserErrors();
      toast.dismiss();
      toast.error(error, { autoClose: 1500 });
    }
  }, [error, clearAllUserErrors, navigateTo]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.dismiss();
      toast.success("Logged in successfully.", { autoClose: 1500 });
      navigateTo("/", { replace: true });
    }
  }, [isAuthenticated, navigateTo]);
  return (
    <>
      <section className="authPage">
        <div className="container login-container">
          <div className="header">
            <h3>Login to your account</h3>
          </div>
          <form onSubmit={handleLogin}>
            <div className="inputTag">
              <label>Login As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Employer">Login as an Employer</option>
                  <option value="Job Seeker">Login as a Job Seeker</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Email</label>
              <div>
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              Login
            </button>
            <Link to={"/register"}>Register Now</Link>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
