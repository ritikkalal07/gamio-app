const nodemailer = require("nodemailer");


let transporterPromise = (async () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(
      "[Mailer] Missing SMTP credentials in .env (EMAIL_HOST, EMAIL_USER, EMAIL_PASS)"
    );
    throw new Error("SMTP credentials missing — please configure your .env properly");
  }

  console.log(`[Mailer] Connecting to SMTP server: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true", // true = port 465 (SSL)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("[Mailer] SMTP connection verified successfully ✅");
  } catch (err) {
    console.error("[Mailer] SMTP verification failed ❌:", err.message);
  }

  return transporter;
})();


async function sendOtpEmail(to, otp, purpose = "Login") {
  const transporter = await transporterPromise;

  const subject =
    purpose === "Forgot"
      ? "Reset Your Password - Gamio"
      : `${purpose} OTP - Gamio`;

  const html = `
    <div style="font-family:Arial;padding:20px;border:1px solid #eee;">
      <h2 style="color:#4ECDC4;">Gamio ${purpose} OTP</h2>
      <p>Your One-Time Password (OTP) is:</p>
      <h1 style="letter-spacing:4px;">${otp}</h1>
      <p>This OTP will expire in ${process.env.OTP_EXPIRE_MINUTES || 5} minutes.</p>
      <p style="margin-top:20px;">If you didn’t request this, you can safely ignore it.</p>
      <p>— Gamio Team</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from:
      process.env.EMAIL_FROM ||
      `"Gamio" <${process.env.EMAIL_USER || "no-reply@gamio.app"}>`,
    to,
    subject,
    html,
  });

  console.log(`[Mailer] OTP email sent successfully to ${to}`);
  return info;
}

module.exports = { sendOtpEmail };

// const nodemailer = require('nodemailer');

// let transporterPromise = (async () => {
//   if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//     console.log(`[Mailer] Connecting to SMTP server: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: Number(process.env.EMAIL_PORT || 587),
//       secure: process.env.EMAIL_SECURE === 'true', 
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     try {
//       await transporter.verify();
//       console.log('[Mailer] SMTP connection verified successfully.');
//     } catch (err) {
//       console.error('[Mailer] SMTP verification failed:', err);
//     }

//     return transporter;
//   } else {
//     const testAccount = await nodemailer.createTestAccount();
//     console.log('[Mailer] Ethereal account created for development:');
//     console.log('  User:', testAccount.user);
//     console.log('  Pass:', testAccount.pass);

//     return nodemailer.createTransport({
//       host: 'smtp.ethereal.email',
//       port: 587,
//       secure: false,
//       auth: {
//         user: testAccount.user,
//         pass: testAccount.pass
//       }
//     });
//   }
// })();

// async function sendOtpEmail(to, otp, purpose = 'Login') {
//   const transporter = await transporterPromise;

//   console.log(`[Mailer] Connecting to SMTP server: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
//   await transporter.verify();
//   console.log(`[Mailer] SMTP connection verified successfully.`);

//   if (process.env.NODE_ENV !== 'production') {
//     console.log(`[DEBUG] Generated OTP for ${to}: ${otp}`);
//   }

//   const info = await transporter.sendMail({
//     from: process.env.EMAIL_FROM || '"Gamio" <no-reply@gamio.app>',
//     to,
//     subject: `${purpose} OTP - Gamio`,
//     html: `<p>Your ${purpose} OTP is <b>${otp}</b>. It expires in ${process.env.OTP_EXPIRE_MINUTES || 5} minutes.</p>`
//   });

//   console.log(`[Mailer] OTP email sent to ${to}`);
  
//   const previewUrl = nodemailer.getTestMessageUrl(info);
//   if (previewUrl) console.log(`[Mailer] Email preview URL: ${previewUrl}`);

//   return info;
// }

// module.exports = { sendOtpEmail };
