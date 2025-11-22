const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");


router.post("/register", ctrl.signup);
router.post("/verify-otp", ctrl.verifySignup);
router.post("/login", ctrl.login);
router.post("/resend-signup-otp", ctrl.resendSignupOtp);
router.post("/resend-otp", ctrl.resendOtp);

router.post("/forgot-password", ctrl.forgotPassword);

router.post("/verify-forgot-otp", ctrl.verifyForgotOtp);

router.post("/reset-password", ctrl.resetPassword);

module.exports = router;
