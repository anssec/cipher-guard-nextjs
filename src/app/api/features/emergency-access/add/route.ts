import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import validator from "validator";
import bcrypt from "bcrypt";
import { verifyToken, verifyIsUser } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);

    const { email, confirmPassword, password } = await req.json();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (!validator.isEmail(email)) return apiResponse(false, "Enter valid email id.", 422);
    if (confirmPassword.length < 8) return apiResponse(false, "Password is too short. minimum length is 8.", 422);
    if (!passwordRegex.test(password)) return apiResponse(false, "Password must contain at least one lowercase letter, one uppercase letter, and one special symbol.", 422);
    if (confirmPassword !== password) return apiResponse(false, "Password and Confirm Password is not equal.", 422);

    const hashPassword = await bcrypt.hash(password, 10);
    try {
      await User.findByIdAndUpdate(decoded.id, { emergencyMail: email, emergencyAccessPasswd: hashPassword }, { new: true });
      return apiResponse(true, "Emergency Access added successfully", 200);
    } catch {
      return apiResponse(false, "Emergency Email is already registered", 422);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
