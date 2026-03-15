import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { verifyToken, verifyIsUser } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);

    const userDetails = await User.findById(decoded.id);
    return apiResponse(true, null, 200, userDetails);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
