import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { otpEmailTemplate } from "../utils/emailTemplates.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendOtpEmail = async (to, subject, otpCode) => {
  const htmlContent = otpEmailTemplate(otpCode);

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
