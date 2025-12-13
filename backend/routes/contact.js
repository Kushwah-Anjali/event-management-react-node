const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
import Logo from "./Logo";
require("dotenv").config();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, error: "All fields are required!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Admin Email (you)
    const adminMail = {
      from: `"Event Manager Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📨 New Inquiry from ${name}`,
      html: `
        <div style="background:#f9fafc;padding:20px;border-radius:10px;">
          <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;">
        <img 
  src="https://yourdomain.com/logo.png" 
  alt="Eventify Logo" 
  width="40"
  style="vertical-align:middle;"
/>
<span style="margin-left:8px;font-weight:bold;">Eventify</span>

           
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Message:</b></p>
            <blockquote style="border-left:4px solid #007bff;padding-left:10px;">${message}</blockquote>
            <p style="font-size:12px;color:#888;">Sent via Event Management Website 💼</p>
          </div>
        </div>
      `,
    };

    // Auto reply to user
    const autoReply = {
      from: `"Event Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We’ve received your message!",
      html: `
        <div style="background:#f8f9fa;padding:20px;">
          <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:20px;text-align:center;">
            <img src="https://img.icons8.com/color/96/event.png" alt="logo" width="80"/>
            <h2 style="color:#007bff;">Thanks for Reaching Out!</h2>
            <p style="color:#555;">Hey <b>${name}</b>, your message has been received by our team.</p>
            <p style="font-style:italic;">"${message}"</p>
            <p>We’ll get back to you within 24 hours 🚀</p>
            <hr/>
            <p style="color:#888;font-size:12px;">Event Manager • Mumbai, India</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(autoReply);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.json({ success: false, error: "Failed to send message. Try again later." });
  }
});

module.exports = router;
