const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, error: "All fields are required!" });
  }

  try {
    // 1️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // 2️⃣ Professional HTML email for admin
    const adminMail = {
      from: `"Event Manager Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Message from ${name}`,
      html: `
        <div style="font-family:'Poppins',sans-serif;color:#333;line-height:1.6;">
          <h2 style="color:#505add;">📥 New Contact Inquiry</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b></p>
          <div style="background:#f7f7f7;padding:12px;border-radius:8px;">
            ${message}
          </div>
          <hr style="border:0.5px solid #ddd;margin-top:20px;">
          <p style="font-size:12px;color:#888;">Sent via Event Management Contact Form 💼</p>
        </div>
      `,
    };

    // 3️⃣ Auto-reply to user
    const autoReply = {
      from: `"Event Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ We’ve received your message!",
      html: `
        <div style="font-family:'Poppins',sans-serif;color:#333;">
          <h3>Hey ${name},</h3>
          <p>Thanks for reaching out! We’ve received your message:</p>
          <blockquote style="border-left:4px solid #505add;padding-left:10px;color:#555;">
            ${message}
          </blockquote>
          <p>Our team will respond within 24 hours.</p>
          <p style="color:#505add;">– Event Manager Support Team</p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMail);
    await transporter.sendMail(autoReply);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.json({ success: false, error: "Failed to send message. Try again later." });
  }
});

module.exports = router;
