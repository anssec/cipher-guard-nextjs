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
    if (nodeCache.has(`getAllNote_${userId}`)) {
      const allNote = JSON.parse(nodeCache.get(`getAllNote_${userId}`) as string);
      return apiResponse(true, null, 200, allNote);
    }

    const user = await User.findById(userId).populate("secureNotes");
    const allNote = user.secureNotes;
    nodeCache.set(`getAllNote_${userId}`, JSON.stringify(allNote), 300);
    return apiResponse(true, null, 200, allNote);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
