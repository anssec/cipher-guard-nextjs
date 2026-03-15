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
    if (nodeCache.has(`favoriteNotes_${userId}`)) {
      const favoriteNotes = JSON.parse(nodeCache.get(`favoriteNotes_${userId}`) as string);
      return apiResponse(true, null, 200, favoriteNotes);
    }

    const user = await User.findById(userId).populate("secureNotes");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const favoriteNotes = user.secureNotes.filter((note: any) => note.favorite);
    nodeCache.set(`favoriteNotes_${userId}`, JSON.stringify(favoriteNotes), 300);
    return apiResponse(true, null, 200, favoriteNotes);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
