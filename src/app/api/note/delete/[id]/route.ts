import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import secureNotes from "@/lib/models/secureNotes";
import { verifyToken, verifyIsUser, decryptVaultPin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";
import nodeCache from "@/lib/utils/nodeCache";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);
    const vaultPin = decryptVaultPin(req);
    if (!vaultPin) return apiResponse(false, "Enter Vault Pin", 401);

    const { id: notesId } = await params;
    const user = await User.findById(decoded.id);
    if (!user.secureNotes.some((noteId: { toString: () => string }) => noteId.toString() === notesId)) {
      return apiResponse(false, "Not authorized to delete this note", 403);
    }

    await secureNotes.findByIdAndDelete(notesId);
    await User.updateOne({ _id: decoded.id }, { $pull: { secureNotes: notesId } });
    nodeCache.del(`getAllNote_${decoded.id}`);
    nodeCache.del(`favoriteNotes_${decoded.id}`);
    return apiResponse(true, "note delete successfully", 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
