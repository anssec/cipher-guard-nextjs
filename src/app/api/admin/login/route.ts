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
    const { email, password } = await req.json();

    if (!email || !password) return apiResponse(false, "Enter all fields", 422);
    if (!validator.isEmail(email)) return apiResponse(false, "Enter valid email id.", 422);

    const users = await User.findOne({ email }).select("+password");
    if (!users) return apiResponse(false, "user not found. Please register first", 404);
    if (users.role !== "admin") return apiResponse(false, "Login is restricted to administrators only", 403);

    const isPasswordMatch = await bcrypt.compare(password, users.password);
    if (!isPasswordMatch) return apiResponse(false, "Enter correct Password", 401);

    const currentDate = formatDate();

    await mailSender(
      users.email,
      "Login Alert",
      `<p>Dear ${users.firstName},</p><p>We noticed an admin login to your account from a new device on ${currentDate}.</p>`
    );

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
    });

    response.cookies.set("token", token, {
      httpOnly: true, secure: true, sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
