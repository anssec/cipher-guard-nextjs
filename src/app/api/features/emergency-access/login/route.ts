import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { mailSender } from "@/lib/utils/mailSender";
import { apiResponse } from "@/lib/utils/response";
import { formatDate } from "@/lib/utils/dateFormatter";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { emergencyMail, password } = await req.json();

    if (!emergencyMail || !password) return apiResponse(false, "Enter all fields", 422);
    if (!validator.isEmail(emergencyMail)) return apiResponse(false, "Enter valid email id.", 422);

    const users = await User.findOne({ emergencyMail });
    if (!users) return apiResponse(false, "Emergency email not found.", 404);
    if (users.accountLock) return apiResponse(false, "Your Accout is locked contact admin@devglimpse.com", 423);

    const isPasswordMatch = await bcrypt.compare(password, users.emergencyAccessPasswd);

    if (!isPasswordMatch) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (users.wrongPasswdAttempt.lastAttemptTime && users.wrongPasswdAttempt.lastAttemptTime < thirtyMinutesAgo) {
        users.wrongPasswdAttempt.attempts = 0;
        users.wrongPasswdAttempt.lastAttemptTime = undefined;
        await users.save();
      }
      if (users.wrongPasswdAttempt.attempts === 4 && users.wrongPasswdAttempt.lastAttemptTime) {
        users.accountLock = true;
        await users.save();
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

      const currentDate = formatDate();

      await mailSender(users.email, "Login Alert", `<p>Dear ${users.firstName},</p><p>We noticed an emergency login to your account from a new device on ${currentDate}. If this was you, you can ignore this message.</p>`);

      const payload = { email: users.email, id: users._id, role: users.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "6h" });

      const response = NextResponse.json({
        success: true,
        message: `Welcome back ${users.firstName}`,
        data: token,
      });

      response.cookies.set("token", token, {
        httpOnly: true, secure: true, sameSite: "strict",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      return response;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
