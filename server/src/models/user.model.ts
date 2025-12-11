import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
  otp?: string;
  otpExpire?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store hashed password
    emailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpire: { type: Date },
  },
  { timestamps: true }
);

// Index for OTP expiry (auto-delete expired OTPs)
UserSchema.index({ otpExpire: 1 }, { expireAfterSeconds: 0 });

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
