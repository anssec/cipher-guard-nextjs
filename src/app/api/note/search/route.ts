import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { verifyToken, verifyIsUser, decryptVaultPin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);
    const vaultPin = decryptVaultPin(req);
    if (!vaultPin) return apiResponse(false, "Enter Vault Pin", 401);

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) return apiResponse(false, "Search query is required", 422);

    const user = await User.findById(decoded.id).populate("secureNotes");
    const escapedName = escapeRegExp(name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchResult = user.secureNotes.filter((note: any) =>
      new RegExp(escapedName, "i").test(note.name)
    );
    return apiResponse(true, null, 200, searchResult.length > 0 ? searchResult : "No result found");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
