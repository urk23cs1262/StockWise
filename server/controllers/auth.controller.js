import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, EMAIL_USER, EMAIL_PASS } from "../config/env.js";
import { json } from "express";
import Watchlist from "../models/watchlist.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const SignUp = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      country,
      investmentGoals,
      riskTolerance,
      preferredIndustry,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    if (!password || password.length < 6) {
      const error = new Error("Password must be at least 6 characters long.");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      country,
      investmentGoals,
      riskTolerance,
      preferredIndustry,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: { token, user: newUser },
    });
  } catch (error) {
    next(error);
  }
};

export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const error = new Error("incorrect password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      }
    });
  } catch (error) {
    next(error);
  }

}

export const SignOut = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Watchlist.findOneAndDelete({ user: userId });

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User and associated watchlist deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const ForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found with this email");
      error.statusCode = 404;
      throw error;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    user.otp = otpHash;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password - OTP Verification",
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f6f9fc;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #2d3748;
        }
        
        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .otp-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .otp-code {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 32px;
            font-weight: bold;
            padding: 15px 30px;
            border-radius: 8px;
            letter-spacing: 8px;
            text-align: center;
            min-width: 200px;
        }
        
        .expiry-note {
            text-align: center;
            color: #e53e3e;
            font-weight: 500;
            margin: 20px 0;
            padding: 10px;
            background-color: #fed7d7;
            border-radius: 6px;
            border-left: 4px solid #e53e3e;
        }
        
        .warning {
            background-color: #fffaf0;
            border: 1px solid #fbd38d;
            border-radius: 8px;
            padding: 15px;
            margin: 25px 0;
            font-size: 14px;
            color: #744210;
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            background-color: #f7fafc;
            color: #718096;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }
        
        .support {
            margin-top: 15px;
            color: #4a5568;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .otp-code {
                font-size: 28px;
                padding: 12px 20px;
                letter-spacing: 6px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">StockWise</div>
            <h1>Password Reset</h1>
        </div>
        
        <div class="content">
            <h2 class="greeting">Hello ${user.username}!</h2>
            
            <p class="message">
                You requested to reset your password. Use the OTP code below to verify your identity and create a new password.
            </p>
            
            <div class="otp-container">
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="expiry-note">
                ⚠ This OTP will expire in 5 minutes
            </div>
            
            <div class="warning">
                <strong>Security Tip:</strong> If you didn't request this password reset, please ignore this email or contact our support team immediately.
            </div>
        </div>
        
        <div class="footer">
            <p style="margin-top: 15px; font-size: 12px; color: #a0aec0;">
                © ${new Date().getFullYear()} StockWise. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your registered email",
    });
  } catch (error) {
    next(error);
  }
};


export const VerifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    if (
      !user.otp ||
      user.otp !== otpHash ||
      user.otpExpire < Date.now()
    ) {
      const error = new Error("Invalid or expired OTP");
      error.statusCode = 400;
      throw error;
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "10m",
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: { resetToken },
    });
  } catch (error) {
    next(error);
  }
};


export const ResetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      const error = new Error("Unauthorized or missing token");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};
