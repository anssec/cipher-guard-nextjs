import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import bcrypt from "bcrypt";
import { verifyToken } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);

    const { vaultPin } = await req.json();
    if (!vaultPin || vaultPin.toString().length !== 6) {
      return apiResponse(false, "Enter a 6-digit number", 422);
    }

    const user = await User.findById(decoded.id);
    if (user.vaultPin) {
      return apiResponse(false, "vault pin already created", 422);
    }

    const hashVaultPin = await bcrypt.hash(vaultPin.toString(), 12);
    user.vaultPin = hashVaultPin;
    await user.save();
    return apiResponse(true, "pin created successfully", 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
