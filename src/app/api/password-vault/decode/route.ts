import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import CryptoJS from "crypto-js";
import { verifyToken, verifyIsUser, decryptVaultPin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);
    const vaultPin = decryptVaultPin(req);
    if (!vaultPin) return apiResponse(false, "Enter Vault Pin", 401);

    const { encodePasswd } = await req.json();
    if (!encodePasswd) return apiResponse(false, "Enter encoded password", 406);

    const decode = CryptoJS.AES.decrypt(encodePasswd, vaultPin).toString(CryptoJS.enc.Utf8);
    return apiResponse(true, null, 200, decode);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    return apiResponse(false, "Internal server error. Try again.", 500);
  }
}
