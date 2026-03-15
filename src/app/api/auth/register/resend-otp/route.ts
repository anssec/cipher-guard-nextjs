import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import OTP from "@/lib/models/otp";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import { mailSender } from "@/lib/utils/mailSender";
import { apiResponse } from "@/lib/utils/response";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const cookiesValue = cookieStore.get("data")?.value || req.headers.get("authorization")?.replace("Bearer ", "");

    if (!cookiesValue) {
      return apiResponse(false, "Please register first", 422);
    }

    const decode = jwt.verify(cookiesValue, process.env.JWT_SECRET!) as { email: string };
    if (!decode) {
      return apiResponse(false, "unable to verify", 401);
    }

    const otp = otpGenerator.generate(8, {
      digits: true, lowerCaseAlphabets: false,
      upperCaseAlphabets: false, specialChars: false,
    });

    await OTP.create({ email: decode.email, otp });

    await mailSender(decode.email, "Verify Your Email", `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Email Verification</title><style>body{font-family:'Arial',sans-serif;background-color:#f4f4f4;margin:0;padding:0}.container{max-width:600px;margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1)}h1{color:#262626}p{font-size:16px;line-height:1.5;color:#262626}.otp{display:inline-block;padding:8px 16px;font-size:18px;font-weight:bold;background-color:#1a82e2;color:#fff;border-radius:4px}.footer{border-top:2px solid #ccc;padding-top:20px;margin-top:20px}</style></head><body><div class="container"><h1>Email Verification</h1><p>Thank you for signing up with CipherGuard. To complete your registration, please use the following One-Time Password (OTP):</p><p class="otp">${otp}</p><p>This OTP is valid for 15 minutes. Do not share it with anyone for security reasons.</p><p>If you did not sign up for CipherGuard, please ignore this email.</p><div class="footer"><p>Best,<br><a href="https://cleverpentester.com" target="_blank">The CipherGuard team</a></p></div></div></body></html>`);

    return apiResponse(true, "OTP send successfully", 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
