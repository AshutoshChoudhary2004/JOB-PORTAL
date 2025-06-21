import { Outlet, Navigate } from "react-router-dom";
import useUserStore from "../stores/apiStores/userStore";
import { toast } from "react-toastify";
import { useEffect } from "react";
const PrivateRoute = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isAuthenticationComplete = useUserStore(
    (state) => state.isAuthenticationComplete
  );

  useEffect(() => {
    if (isAuthenticationComplete && !isAuthenticated) {
      toast.error("You need to be logged in to access this page.", {
        autoClose: 1500,
      });
    }
  }, [isAuthenticationComplete, isAuthenticated]);

  if (!isAuthenticationComplete)
    return <div style={{ width: "100vw", height: "100vh" }}></div>;
  if (isAuthenticated) return <Outlet/>
  
  return <Navigate to="/" />;
};
export default PrivateRoute;
