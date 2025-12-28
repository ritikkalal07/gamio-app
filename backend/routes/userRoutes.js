const express = require("express");
const router = express.Router();

// Import the controller file you provided in your prompt
// Assuming you saved your code in ../controllers/userController.js
const {
  signup,
  resendSignupOtp,
  verifySignup,
  login,
  verifyLogin,
  resendOtp,
  forgotPassword,
  verifyForgotOtp,
  resetPassword
} = require("../controllers/userController");

/* AUTH ROUTES */
router.post("/signup", signup);
router.post("/resend-signup-otp", resendSignupOtp);
router.post("/verify-signup", verifySignup);

router.post("/login", login);
router.post("/verify-login", verifyLogin);
router.post("/resend-otp", resendOtp);

router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOtp);
router.post("/reset-password", resetPassword);

module.exports = router;