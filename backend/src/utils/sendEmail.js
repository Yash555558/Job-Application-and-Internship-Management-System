import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendStatusEmail = async (to, jobTitle, status) => {
  try {
    await transporter.sendMail({
      from: `"ATS System" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Application Status Update`,
      html: `
        <p>Your application for <b>${jobTitle}</b> is now:</p>
        <h3>${status}</h3>
      `
    });
    console.log(`Status email sent successfully to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error.message);
    // Don't throw error to prevent breaking the status update process
    // Email failure shouldn't prevent the status update from completing
  }
};