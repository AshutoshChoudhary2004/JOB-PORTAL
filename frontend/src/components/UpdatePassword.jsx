import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import useUserUpdateStore from "../stores/apiStores/userUpdateStore";
import useUserStore from "../stores/apiStores/userStore";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loading = useUserUpdateStore((state) => state.loading);
  const error = useUserUpdateStore((state) => state.error);
  const isUpdated = useUserUpdateStore((state) => state.isUpdated);
  const updatePassword = useUserUpdateStore((state) => state.updatePassword);
  const clearAllUpdateUserErrors = useUserUpdateStore(
    (state) => state.clearAllUpdateUserErrors
  );
  const getUserDetails = useUserStore((state) => state.getUserDetails);
  const handleUpdatePassword = () => {
    const data = {};
    data.oldPassword = oldPassword;
    data.newPassword = newPassword;
    data.confirmPassword = confirmPassword;
    updatePassword(data);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (isUpdated) {
      toast.dismiss();
      toast.success("Password Updated", { autoClose: 1500 });
      getUserDetails();
      clearAllUpdateUserErrors();
      navigate("/dashboard/my-profile");
    }
  }, [isUpdated, getUserDetails, clearAllUpdateUserErrors, navigate]);

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error, { autoClose: 1500 });
      clearAllUpdateUserErrors();
    }
  }, [error, clearAllUpdateUserErrors]);

  return (
    <div className="account_components update_password_component">
      <h3>Update Password</h3>
      <div>
        <label>Current Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <div>
        <label>New Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <div>
        <label>Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="eye_icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <div className="save_change_btn_wrapper">
        <button
          className="btn"
          onClick={handleUpdatePassword}
          disabled={loading}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
