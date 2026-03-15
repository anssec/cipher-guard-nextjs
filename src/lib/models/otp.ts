import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 15 * 60 },
});

export default mongoose.models.otp || mongoose.model("otp", otpSchema);
