import { NextResponse } from "next/server";
import { apiResponse } from "@/lib/utils/response";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
    response.cookies.set("token", "", { httpOnly: true, secure: true, sameSite: "strict", maxAge: 0 });
    return response;
  } catch {
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
