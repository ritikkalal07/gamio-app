import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register"); 
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name: formData.fullname, 
        email: formData.email,
        password: formData.password,
      });

      setMessage({ type: "success", text: res.data.message || "OTP sent!" });
      setStep("otp");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // handle OTP verification
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", {
        email: formData.email,
        otp,
      });

      setMessage({
        type: "success",
        text: res.data.message || "OTP verified successfully!",
      });

      setTimeout(() => navigate("/Login"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "OTP verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/resend-signup-otp",
        { email: formData.email }
      );
      setMessage({ type: "success", text: res.data.message || "OTP resent!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth__page">
      <div className="auth__image-section">
        <img
          src="https://placehold.co/800x1000/FFD166/333333?text=Join"
          alt="Sports Group"
        />
      </div>

      <div className="auth__container">
        <div className="auth__form">
          <a
            href="/"
            className="nav__logo"
            style={{ display: "block", textAlign: "center", marginBottom: "2rem" }}
          >
            Gamio.
          </a>

          {step === "register" ? (
            <>
              <h1 className="auth__title">Join Gamio Today!</h1>
              <p className="auth__subtitle">
                Create an account to start booking sports venues.
              </p>

              <form onSubmit={handleRegister}>
                <div className="form__group">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    type="text"
                    id="fullname"
                    className="form__input"
                    placeholder="John Doe"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form__group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form__input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form__group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form__input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form__group">
                  <button
                    type="submit"
                    className="btn btn--primary"
                    style={{ width: "100%" }}
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : "Create Account"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth__title">Verify OTP</h1>
              <p className="auth__subtitle">Check your email for the OTP</p>

              <form onSubmit={handleOtpVerify}>
                <div className="form__group">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    className="form__input"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <div className="form__group">
                  <button
                    type="submit"
                    className="btn btn--primary"
                    style={{ width: "100%" }}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>

              <p style={{ textAlign: "center", marginTop: "1rem" }}>
                Didn’t receive OTP?{" "}
                <button
                  onClick={handleResendOtp}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4ECDC4",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  disabled={loading}
                >
                  Resend
                </button>
              </p>
            </>
          )}

          {message.text && (
            <p
              style={{
                textAlign: "center",
                marginTop: "1rem",
                color: message.type === "success" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {message.text}
            </p>
          )}

          {step === "register" && (
            <p style={{ textAlign: "center" }}>
              Already have an account? <a href="/Login">Login</a>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default Register;
