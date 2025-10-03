const nodemailer = require('nodemailer');

let transporterPromise = (async () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log(`[Mailer] Connecting to SMTP server: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: process.env.EMAIL_SECURE === 'true', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    try {
      await transporter.verify();
      console.log('[Mailer] SMTP connection verified successfully.');
    } catch (err) {
      console.error('[Mailer] SMTP verification failed:', err);
    }

    return transporter;
  } else {
    const testAccount = await nodemailer.createTestAccount();
    console.log('[Mailer] Ethereal account created for development:');
    console.log('  User:', testAccount.user);
    console.log('  Pass:', testAccount.pass);

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
})();

async function sendOtpEmail(to, otp, purpose = 'Login') {
  const transporter = await transporterPromise;

  console.log(`[Mailer] Connecting to SMTP server: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
  await transporter.verify();
  console.log(`[Mailer] SMTP connection verified successfully.`);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] Generated OTP for ${to}: ${otp}`);
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Gamio" <no-reply@gamio.app>',
    to,
    subject: `${purpose} OTP - Gamio`,
    html: `<p>Your ${purpose} OTP is <b>${otp}</b>. It expires in ${process.env.OTP_EXPIRE_MINUTES || 5} minutes.</p>`
  });

  console.log(`[Mailer] OTP email sent to ${to}`);
  
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log(`[Mailer] Email preview URL: ${previewUrl}`);

  return info;
}

module.exports = { sendOtpEmail };
