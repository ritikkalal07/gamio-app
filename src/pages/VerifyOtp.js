import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", {
        email,
        otp,
      });
      setMessage(res.data.message);
      if (res.data.success) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="auth__page">
      <div className="auth__container">
        <div className="auth__form">
          <h1 className="auth__title">Verify Your Email</h1>
          <p className="auth__subtitle">
            We sent a One-Time Password (OTP) to <b>{email}</b>. Enter it below to verify your account.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form__group">
              <label htmlFor="otp">OTP Code</label>
              <input
                type="text"
                id="otp"
                className="form__input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="form__group">
              <button type="submit" className="btn btn--primary" style={{ width: "100%" }}>
                Verify OTP
              </button>
            </div>
          </form>
          {message && <p style={{ textAlign: "center", marginTop: "1rem" }}>{message}</p>}
        </div>
      </div>
    </main>
  );
}

export default VerifyOtp;
