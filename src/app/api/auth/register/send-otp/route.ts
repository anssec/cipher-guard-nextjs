import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import OTP from "@/lib/models/otp";
import { mailSender } from "@/lib/utils/mailSender";
import { apiResponse } from "@/lib/utils/response";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { firstName, lastName, email, confirmPassword, password } = await req.json();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return apiResponse(false, "Please fill in all required fields.", 422);
    } else if (!validator.isAlpha(firstName, "en-US", { ignore: " " })) {
      return apiResponse(false, "first name should only contain alphabets.", 422);
    } else if (!validator.isAlpha(lastName, "en-US", { ignore: " " })) {
      return apiResponse(false, "last name should only contain alphabets.", 422);
    } else if (confirmPassword.length < 8) {
      return apiResponse(false, "Password is too short. minimum length is 8.", 422);
    } else if (!passwordRegex.test(password)) {
      return apiResponse(false, "Password must contain at least one lowercase letter, one uppercase letter, and one special symbol.", 422);
    } else if (confirmPassword !== password) {
      return apiResponse(false, "Password and Confirm Password is not equal.", 422);
    } else if (!validator.isEmail(email)) {
      return apiResponse(false, "Enter valid email id.", 422);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = otpGenerator.generate(8, {
      digits: true, lowerCaseAlphabets: false,
      upperCaseAlphabets: false, specialChars: false,
    });

    await OTP.create({ email, otp });

    const payload = { firstName, lastName, email, password: hashPassword };
    const data = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });

    await mailSender(email, "Verify Your Email", `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Email Verification</title><style>body{font-family:'Arial',sans-serif;background-color:#f4f4f4;margin:0;padding:0}.container{max-width:600px;margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1)}h1{color:#262626}p{font-size:16px;line-height:1.5;color:#262626}.otp{display:inline-block;padding:8px 16px;font-size:18px;font-weight:bold;background-color:#1a82e2;color:#fff;border-radius:4px}.footer{border-top:2px solid #ccc;padding-top:20px;margin-top:20px}</style></head><body><div class="container"><h1>Email Verification</h1><p>Thank you for signing up with CipherGuard. To complete your registration, please use the following One-Time Password (OTP):</p><p class="otp">${otp}</p><p>This OTP is valid for 15 minutes. Do not share it with anyone for security reasons.</p><p>If you did not sign up for CipherGuard, please ignore this email.</p><div class="footer"><p>Best,<br><a href="https://cleverpentester.com" target="_blank">The CipherGuard team</a></p></div></div></body></html>`);

    const response = NextResponse.json({ success: true, message: "otp send successfully", data }, { status: 200 });
    response.cookies.set("data", data, {
      httpOnly: true, secure: true, sameSite: "strict",
      expires: new Date(Date.now() + 30 * 60 * 1000),
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
