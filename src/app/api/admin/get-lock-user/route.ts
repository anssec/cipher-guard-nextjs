import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { verifyToken, verifyIsAdmin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";
import nodeCache from "@/lib/utils/nodeCache";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsAdmin(decoded)) return apiResponse(false, "only admin access this route", 401);

    if (nodeCache.has("getLockUser")) {
      const lockUser = JSON.parse(nodeCache.get("getLockUser") as string);
      return apiResponse(true, null, 200, lockUser);
    } else {
      const lockUser = await User.find({ accountLock: true });
      nodeCache.set("getLockUser", JSON.stringify(lockUser), 200);
      return apiResponse(true, null, 200, lockUser);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
