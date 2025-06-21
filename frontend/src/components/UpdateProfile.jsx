import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../stores/apiStores/userStore.js";
import useUserUpdateStore from "../stores/apiStores/userUpdateStore.js";
import { nichesArray } from "../constants/constants.js";
import useUserUpdateFormStore from "../stores/formStores/userUpdateFormStore.js";

const UpdateProfile = () => {
  const user = useUserStore((state) => state.user);
  const loading = useUserUpdateStore((state) => state.loading);
  const error = useUserUpdateStore((state) => state.error);
  const isUpdated = useUserUpdateStore((state) => state.isUpdated);
  const clearAllUpdateUserErrors = useUserUpdateStore(
    (state) => state.clearAllUpdateUserErrors
  );
  const updateUser = useUserUpdateStore((state) => state.updateUser);
  const getUserDetails = useUserStore((state) => state.getUserDetails);

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
    firstNiche,
    setFirstNiche,
    secondNiche,
    setSecondNiche,
    thirdNiche,
    setThirdNiche,
    resume,
    setResume,
    resumePreview,
    setResumePreview,
  } = useUserUpdateFormStore();

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    if (user && user.role === "Job Seeker") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
    }
    if (resume) {
      formData.append("resume", resume);
    }
    updateUser(formData);
  };

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error, { autoClose: 1500 });
      clearAllUpdateUserErrors();
    }
  }, [error, clearAllUpdateUserErrors]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isUpdated) {
      toast.dismiss();
      toast.success("Profile Updated.", { autoClose: 1500 });
      clearAllUpdateUserErrors();
      navigate("/dashboard");
      getUserDetails();
    }
  }, [isUpdated, clearAllUpdateUserErrors, getUserDetails, navigate]);

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const blob = new Blob([reader.result], { type: file.type });
      const blobURL = URL.createObjectURL(blob);
      setResume(file);
      setResumePreview(blobURL);
    };
  };

  return (
    <div className="account_components">
      <h3>Update Profile</h3>
      <div>
        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email Address</label>
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

      {user && user.role === "Job Seeker" && (
        <>
          <div>
            <label>My Preferred Job Niches</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <select
                value={firstNiche}
                onChange={(e) => setFirstNiche(e.target.value)}
              >
                {nichesArray.map((element, index) => {
                  return (
                    <option value={element} key={index}>
                      {element}
                    </option>
                  );
                })}
              </select>
              <select
                value={secondNiche}
                onChange={(e) => setSecondNiche(e.target.value)}
              >
                {nichesArray.map((element, index) => {
                  return (
                    <option value={element} key={index}>
                      {element}
                    </option>
                  );
                })}
              </select>
              <select
                value={thirdNiche}
                onChange={(e) => setThirdNiche(e.target.value)}
              >
                {nichesArray.map((element, index) => {
                  return (
                    <option value={element} key={index}>
                      {element}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div>
            <label>Coverletter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
            />
          </div>
          <div>
            <label>Upload Resume</label>
            <input type="file" onChange={resumeHandler} />
            {user && user.resume && (
              <div>
                <p>Current Resume:</p>
                <button
                  className="view-resume"
                  onClick={() => {
                    window.open(resumePreview, "_blank");
                  }}
                >
                  View Resume
                </button>
              </div>
            )}
          </div>
        </>
      )}
      <div className="save_change_btn_wrapper">
        <button
          className="btn"
          onClick={handleUpdateProfile}
          disabled={loading}
        >
          {" "}
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
