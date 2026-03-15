import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import Notes from "@/lib/models/secureNotes";
import Password from "@/lib/models/passwordVault";
import { verifyToken, verifyIsAdmin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";
import nodeCache from "@/lib/utils/nodeCache";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsAdmin(decoded)) return apiResponse(false, "only admin access this route", 401);

    if (nodeCache.has("allRegisterUser")) {
      const allRegisterUser = JSON.parse(nodeCache.get("allRegisterUser") as string);
      return apiResponse(true, null, 200, allRegisterUser);
    } else {
      const totalUserCount = await User.countDocuments();
      const latestUsers = await User.find().sort({ createdAt: -1 }).limit(6);
      const totalLockedUsers = await User.countDocuments({ accountLock: true });
      const totalNotes = await Notes.countDocuments();
      const totalPassword = await Password.countDocuments();
      const allRegisterUser = {
        allUser: latestUsers,
        totalNotes,
        totalPassword,
        totalUser: totalUserCount,
        totalLockedUser: totalLockedUsers,
      };
      nodeCache.set("allRegisterUser", JSON.stringify(allRegisterUser), 300);
      return apiResponse(true, null, 200, allRegisterUser);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
