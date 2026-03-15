import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { mailSender } from "@/lib/utils/mailSender";
import { apiResponse } from "@/lib/utils/response";
import { formatDate } from "@/lib/utils/dateFormatter";
import nodeCache from "@/lib/utils/nodeCache";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const url = "https://ipgeolocation.abstractapi.com/v1";
    const abstractApiKey = process.env.abstractapiKey;

    if (!email || !password) {
      return apiResponse(false, "Enter all fields", 422);
    }
    if (!validator.isEmail(email)) {
      return apiResponse(false, "Enter valid email id.", 422);
    }

    const users = await User.findOne({ email }).select("+password");
    if (!users) {
      return apiResponse(false, "Invalid email or password", 401);
    } else if (users.accountLock) {
      nodeCache.del("getLockUser");
      return apiResponse(false, "Your Accout is locked contact admin@devglimpse.com", 423);
    }

    const isPasswordMatch = await bcrypt.compare(password, users.password);

    if (!isPasswordMatch) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (users.wrongPasswdAttempt.lastAttemptTime && users.wrongPasswdAttempt.lastAttemptTime < thirtyMinutesAgo) {
        users.wrongPasswdAttempt.attempts = 0;
        users.wrongPasswdAttempt.lastAttemptTime = undefined;
        await users.save();
      }
      if (users.wrongPasswdAttempt.attempts >= 4 && users.wrongPasswdAttempt.lastAttemptTime) {
        users.accountLock = true;
        await users.save();
        nodeCache.del("getLockUser");
        return apiResponse(false, "Your Accout is locked contact admin@devglimpse.com", 423);
      } else {
        users.wrongPasswdAttempt.attempts += 1;
        users.wrongPasswdAttempt.lastAttemptTime = new Date();
        await users.save();
        return apiResponse(false, `wrong password you left ${users.wrongPasswdAttempt.attempts} out of 4`, 401);
      }
    } else {
      users.wrongPasswdAttempt.attempts = 0;
      users.wrongPasswdAttempt.lastAttemptTime = undefined;
      await users.save();

      const ipAddress = (
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-real-ip") ||
        req.headers.get("x-forwarded-for") ||
        ""
      ).split(",");
      const rawIp = ipAddress[0].trim();
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      const ipv6Regex = /^[0-9a-fA-F:]+$/;
      const validIp = (ipv4Regex.test(rawIp) || ipv6Regex.test(rawIp)) ? rawIp : "";

      let responseData: { ip_address: string; city: string; region: string; country: string };
      try {
        const geoRes = await axios.get(`${url}?api_key=${abstractApiKey}&ip_address=${validIp}`);
        responseData = geoRes.data;
      } catch {
        responseData = { ip_address: "NA", city: "NA", region: "NA", country: "NA" };
      }

      const currentDate = formatDate();

      await mailSender(users.email, "Login Alert", `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Login from new device</title><style>body{font-family:'Arial',sans-serif;background-color:#f4f4f4;margin:0;padding:0}.container{max-width:600px;margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1)}h2{font-family:'Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px}p{font-size:16px;line-height:24px;color:#262626}.alert{display:inline-block;padding:8px 16px;font-size:18px;font-weight:bold;background-color:#e74c3c;color:#fff;border-radius:4px}.footer{border-top:2px solid #ccc;padding-top:20px;margin-top:20px}a{text-decoration:none;color:#5865f2}a:hover{text-decoration:underline}</style></head><body><div class="container"><h2>Hey ${users.firstName},</h2><p>Someone tried to log into your CipherGuard account from a new location. If this is you, you can ignore this message.</p><p><strong>Date:</strong> ${currentDate}<br><p><strong>IP Address:</strong> ${responseData.ip_address}<br><strong>Location:</strong> ${responseData.city}, ${responseData.region}, ${responseData.country}</p><p class="alert">New Login Detected</p><p>If this wasn't you, please contact our support team. <strong>support@cleverpentester.com</strong>.</p><div class="footer"><p>Best,<br><a href="https://cleverpentester.com" target="_blank">The CipherGuard team</a></p></div></div></body></html>`);

      const payload = { email: users.email, id: users._id, role: users.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "6h" });

      const response = NextResponse.json({
        success: true,
        message: `Welcome back ${users.firstName}`,
        data: token,
        profile: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          profileImg: users.profileImg,
        },
      }, { status: 200 });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
      });

      return response;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
