import { Outlet, Navigate, useNavigate } from "react-router-dom";
import useUserStore from "../stores/apiStores/userStore";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const AuthorizeRoute = ({ userRole }) => {
  const currentRole = useUserStore((state) => state.user.role);
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (currentRole !== userRole) {
      toast.error("Not authorized", {
        autoClose: 1500,
      });
      navigate("/");
    } else {
      setCheckingAuth(false);
    }
  }, [currentRole, userRole, navigate]);

  if (checkingAuth) return <div style={{ width: "100vw", height: "100vh" }}></div>;
  return <Outlet />;
};

export default AuthorizeRoute;
