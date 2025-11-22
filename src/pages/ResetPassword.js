import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = location.state?.token;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        token,
        password,
      });
      setMessage({ type: "success", text: res.data.message || "Password reset successful!" });

      setTimeout(() => navigate("/Login"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to reset password",
      });
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

          <h1 className="auth__title">Reset Your Password</h1>
          <p className="auth__subtitle">
            Enter your new password below to complete the reset process.
          </p>

          <form onSubmit={handleResetPassword}>
            <div className="form__group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                className="form__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form__group">
              <label htmlFor="confirm">Confirm Password</label>
              <input
                type="password"
                id="confirm"
                className="form__input"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>

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
          src="https://placehold.co/800x1000/4ECDC4/FFFFFF?text=Secure"
          alt="Reset password"
        />
      </div>
    </main>
  );
}

export default ResetPassword;
