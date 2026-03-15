import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import jwt from "jsonwebtoken";
import OTP from "@/lib/models/otp";
import { mailSender } from "@/lib/utils/mailSender";
import { apiResponse } from "@/lib/utils/response";
import nodeCache from "@/lib/utils/nodeCache";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { otp } = await req.json();
    const cookieStore = await cookies();
    const cookiesValue = cookieStore.get("data")?.value || req.headers.get("authorization")?.replace("Bearer ", "");

    if (!cookiesValue) {
      return apiResponse(false, "Please register first", 422);
    }

    const decode = jwt.verify(cookiesValue, process.env.JWT_SECRET!) as {
      firstName: string; lastName: string; email: string; password: string;
    };
    if (!decode) {
      return apiResponse(false, "unable to verify", 401);
    }

    const recentOtp = await OTP.findOne({ email: decode.email }).sort({ createdAt: -1 }).limit(1);
    if (!recentOtp) {
      return apiResponse(false, "OTP not found. Try to resend otp", 400);
    }
    if (otp !== recentOtp.otp) {
      return apiResponse(false, "Invalid otp", 422);
    }

    const isUserAlreadyRegister = await User.findOne({ email: decode.email });
    if (isUserAlreadyRegister) {
      return apiResponse(false, "Email is already registered", 422);
    }

    const [First, Last] = [decode.firstName, decode.lastName].map((str) => str.charAt(0));

    await User.create({
      firstName: decode.firstName,
      lastName: decode.lastName,
      email: decode.email,
      isEmailVerify: true,
      password: decode.password,
      profileImg: `https://api.dicebear.com/7.x/initials/svg?seed=${First}${Last}`,
    });

    await mailSender(decode.email, "Welcome to CipherGuard", `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome to CipherGuard</title><style>body{font-family:'Arial',sans-serif;background-color:#f4f4f4;margin:0;padding:0}.container{max-width:600px;margin:20px auto;background-color:#f4f4f4;padding:20px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1)}h1{color:#262626}p{font-size:16px;line-height:1.5;color:#262626}ul{list-style-type:none;padding:0}ul li::before{content:"✓ ";color:#262626}.footer{border-top:2px solid #ccc;padding-top:20px;margin-top:20px}@media screen and (max-width:600px){.container{padding:15px}}</style></head><body><div class="container"><h1>${decode.firstName}, Welcome to CipherGuard!</h1><p>You are now part of the CipherGuard family! Get ready to depart on an exciting journey with us!</p><p>To make things extra special for you, starting today, we will send you a series of exclusive emails with amazing tips and tricks to get the most out of.</p><p>Get ready!</p><h2>Key Features:</h2><ul><li>Generate unique Passwords</li><li>No forgot password policy</li><li>Login Alert!</li><li>Username Generator option</li><li>Password Storage and Encryption</li><li>Secure Notes</li><li>4 password login attempts</li><li>Emergency Access</li><li>Vault password</li></ul><div class="footer"><p>Best,<br><a href="https://cleverpentester.com" target="_blank">The CipherGuard team</a></p></div></div></body></html>`);

    nodeCache.del("allRegisterUser");
    return apiResponse(true, "Account create successfully", 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
