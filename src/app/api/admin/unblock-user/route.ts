import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { verifyToken, verifyIsAdmin } from "@/lib/auth";
import { mailSender } from "@/lib/utils/mailSender";
import { apiResponse } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsAdmin(decoded)) return apiResponse(false, "only admin access this route", 401);

    const { id, unblock } = await req.json();
    if (!id) return apiResponse(false, "User ID is required", 422);

    if (unblock === false) {
      const findBlockUserAndUnBlock = await User.findByIdAndUpdate(
        id,
        { wrongPasswdAttempt: { attempts: 0, lastAttemptTime: undefined }, accountLock: unblock },
        { new: true }
      );
      if (!findBlockUserAndUnBlock) return apiResponse(false, "User not found", 404);

      await mailSender(
        findBlockUserAndUnBlock.email,
        "Account Status",
        `<p>Dear ${findBlockUserAndUnBlock.firstName},</p><p>We are pleased to inform you that your account has been successfully unblocked.</p>`
      );
      return apiResponse(true, `User unblock ${findBlockUserAndUnBlock.firstName}`, 200);
    } else {
      return apiResponse(false, "Invalid unblock value", 422);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
