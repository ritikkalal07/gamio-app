import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (token && user) {
        // ✅ Store token + user info
        localStorage.setItem("token", token);
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", user.username || user.name || "User");
        localStorage.setItem("user_type", user.user_type || "user");
        localStorage.setItem("email", user.email || "");

        setMessage("Login successful!");

        // ✅ Redirect based on role
        setTimeout(() => {
          if (user.user_type === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 800);
      } else {
        setMessage("Invalid response from server. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Login failed. Please try again.");
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

          <h1 className="auth__title">Welcome Back!</h1>
          <p className="auth__subtitle">
            Login to continue your journey with Gamio.
          </p>

          <form onSubmit={handleLogin}>
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
              <label htmlFor="password">Password</label>
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
              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {message && (
            <p
              style={{
                textAlign: "center",
                marginTop: "1rem",
                color: message.includes("successful") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}

          <p style={{ textAlign: "center" }}>
            <Link to="/Forgot">Forgot Password?</Link> |{" "}
            <Link to="/Register">Create an Account</Link>
          </p>
        </div>
      </div>

      <div className="auth__image-section">
        <img
          src="https://placehold.co/800x1000/4ECDC4/FFFFFF?text=Play"
          alt="Person playing sports"
        />
      </div>
    </main>
  );
}

export default Login;
