import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { verifyToken, verifyIsUser, decryptVaultPin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";
import nodeCache from "@/lib/utils/nodeCache";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);
    const vaultPin = decryptVaultPin(req);
    if (!vaultPin) return apiResponse(false, "Enter Vault Pin", 401);

    const userId = decoded.id;
    if (nodeCache.has(`getSavedPasswd_${userId}`)) {
      const getAllSavedPasswd = JSON.parse(nodeCache.get(`getSavedPasswd_${userId}`) as string);
      return apiResponse(true, null, 200, getAllSavedPasswd);
    } else {
      const user = await User.findById(userId).populate("passwordVault");
      const getAllSavedPasswd = user.passwordVault;
      nodeCache.set(`getSavedPasswd_${userId}`, JSON.stringify(getAllSavedPasswd), 300);
      return apiResponse(true, null, 200, getAllSavedPasswd);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    return apiResponse(false, "Internal server error. Try again.", 500);
  }
}
