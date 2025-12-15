import { User } from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt";
import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: true,
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASS,
//   },
// });

export const signup = async (req: Request, res: Response) => {
  const { email, username, password, phone } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered. Please log in." });
    }

    // Create new user directly (no OTP)
    const newUser = new User({
      email,
      username,
      phone,
      password, // ⚠️ hash this before saving!
      emailVerified: true, // ✅ mark as verified immediately
    });

    await newUser.save();

    res.json({ message: "Signup successful", user: newUser });
    console.log("New user signed up:", email);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error signing up" });
  }
};

// Get current user
export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    };

    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      return res
        .status(400)
        .json({ message: "Email not verified. Please verify OTP first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Send OTP for signup
// export const sendOtp = async (req: Request, res: Response) => {
//   const { email, username, password, phone } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

//     if (existingUser) {
//       if (existingUser.emailVerified) {
//         return res
//           .status(400)
//           .json({ message: "User already registered. Please log in." });
//       } else {
//         existingUser.otp = otp;
//         existingUser.otpExpire = otpExpire;
//         existingUser.username = username;
//         existingUser.password = password;
//         existingUser.phone = phone;

//         await existingUser.save();
//       }
//     } else {
//       const newUser = new User({
//         email,
//         username,
//         phone,
//         password,
//         otp,
//         otpExpire,
//         emailVerified: false,
//       });
//       await newUser.save();
//     }

//   Send OTP email
//     await transporter.sendMail({
//       from: `"Blogify" <${process.env.SMTP_EMAIL}>`,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}. It expires in 5 minutes.`,
//       html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
//     });

//     res.json({
//       message: existingUser ? "OTP resent to email" : "OTP sent to email",
//     });
//     console.log("OTP email sent to:", email);
//   } catch (err) {
//     console.error("Error sending OTP:", err);
//     res.status(500).json({ message: "Error sending OTP" });
//   }
// };

// Verify OTP and complete signup
// export const verifyOtp = async (req: Request, res: Response) => {
//   const { email, otp, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (
//       !user ||
//       user.otp !== otp ||
//       !user.otpExpire ||
//       user.otpExpire < new Date()
//     ) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     user.password = hashedPassword;
//     user.emailVerified = true;
//     user.otp = undefined;
//     user.otpExpire = undefined;

//     await user.save();

//     if (!JWT_SECRET) {
//       throw new Error("JWT_SECRET is not defined");
//     }

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

//     res.json({
//       message: "Signup successful",
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         phone: user.phone,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error verifying OTP" });
//   }
// };
