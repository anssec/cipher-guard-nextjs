import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import CryptoJS from "crypto-js";
import { verifyToken, verifyIsUser, decryptVaultPin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);
    const vaultPin = decryptVaultPin(req);
    if (!vaultPin) return apiResponse(false, "Enter Vault Pin", 401);

    const { id } = await params;
    const user = await User.findById(decoded.id).populate("secureNotes");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const note = user.secureNotes.filter((value: any) => value._id == id);

    if (!note[0]) return apiResponse(false, "Note not found", 404);
    if (!note[0].encrypt) return apiResponse(true, null, 200, note[0].notes);

    const decryptedNote = CryptoJS.AES.decrypt(note[0].notes, vaultPin).toString(CryptoJS.enc.Utf8);
    return apiResponse(true, null, 200, decryptedNote);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
