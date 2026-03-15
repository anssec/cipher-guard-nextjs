import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import { verifyToken, verifyIsUser } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);

    const { vaultPin } = await req.json();
    const user = await User.findById(decoded.id);

    if (!vaultPin || vaultPin.toString().length !== 6) {
      return apiResponse(false, "Enter 6-digit vault pin", 422);
    } else if (!user.vaultPin) {
      return apiResponse(false, "create 6-digit vault pin", 422);
    } else if (!(await bcrypt.compare(vaultPin, user.vaultPin))) {
      return apiResponse(false, "Vault pin is incorrect", 401);
    }

    const encrypt = CryptoJS.AES.encrypt(vaultPin, process.env.SECUREPIN!).toString();
    return apiResponse(true, "vault unlock", 200, encrypt);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
