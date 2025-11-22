import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState("request"); // "request" → send OTP, "verify" → verify OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", { email });
      setMessage({ type: "success", text: res.data.message || "OTP sent to your email" });
      setStep("verify");
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/verify-forgot-otp", { email, otp });
      const { token } = res.data;
      setMessage({ type: "success", text: "OTP verified! Redirecting..." });

      setTimeout(() => {
        navigate("/ResetPassword", { state: { token } });
      }, 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Invalid OTP" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth__page">
      <div className="auth__container">
        <div className="auth__form">
          <a
            href="/"
            className="nav__logo"
            style={{ display: "block", textAlign: "center", marginBottom: "2rem" }}
          >
            Gamio.
          </a>

          {step === "request" ? (
            <>
              <h1 className="auth__title">Forgot Password?</h1>
              <p className="auth__subtitle">
                Enter your registered email and we’ll send an OTP to reset your password.
              </p>
              <form onSubmit={handleSendOtp}>
                <div className="form__group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form__input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form__group">
                  <button type="submit" className="btn btn--primary" style={{ width: "100%" }} disabled={loading}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth__title">Verify OTP</h1>
              <p className="auth__subtitle">Enter the OTP sent to your email</p>
              <form onSubmit={handleVerifyOtp}>
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
                  <button type="submit" className="btn btn--primary" style={{ width: "100%" }} disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            </>
          )}

          {message.text && (
            <p
              style={{
                textAlign: "center",
                marginTop: "1rem",
                color: message.type === "success" ? "green" : "red",
              }}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>

      <div className="auth__image-section">
        <img
          src="https://placehold.co/800x1000/FF6B6B/FFFFFF?text=Reset"
          alt="Forgot password"
        />
      </div>
    </main>
  );
}

export default ForgotPassword;

// import React from "react";
// import Login from "./Login";
// function Forgot()
// {
//     return(
//         <main className="auth__page">
//         <div className="auth__container">
//             <div className="auth__form">
//                 <a href="index.html" className="nav__logo" style={{display: 'block', textAlign: 'center', marginBottom: '2rem'}}>Gamio.</a>
//                 <h1 className="auth__title">Forgot Password?</h1>
//                 <p className="auth__subtitle">No worries, we'll send you reset instructions.</p>
//                 <form>
//                     <div className="form__group"><label for="email">Email Address</label><input type="email" id="email" className="form__input" placeholder="you@example.com" required/></div>
//                     <div className="form__group"><button type="submit" className="btn btn--primary" style={{width: '100%'}}>Reset Password</button></div>
//                 </form>
//                 <p style={{textAlign: 'center'}}><a href="Login">Back to Login</a></p>
//             </div>
//         </div>
//         <div className="auth__image-section"><img src="https://placehold.co/800x1000/FF6B6B/FFFFFF?text=Reset" alt="Illustration"/></div>
//     </main>
//     );
// }
// export default Forgot;