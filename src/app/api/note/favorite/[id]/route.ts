import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import secureNotes from "@/lib/models/secureNotes";
import { verifyToken, verifyIsUser, decryptVaultPin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";
import nodeCache from "@/lib/utils/nodeCache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);
    const vaultPin = decryptVaultPin(req);
    if (!vaultPin) return apiResponse(false, "Enter Vault Pin", 401);

    const { favorite } = await req.json();
    const { id } = await params;

    const user = await User.findById(decoded.id);
    if (!user.secureNotes.some((noteId: { toString: () => string }) => noteId.toString() === id)) {
      return apiResponse(false, "Not authorized to update this note", 403);
    }

    const updateNotes: { favorite?: boolean } = {};
    if (favorite === true || favorite === false) {
      updateNotes.favorite = favorite;
    }

    await secureNotes.findByIdAndUpdate(id, updateNotes, { new: true });
    nodeCache.del(`getAllNote_${decoded.id}`);
    nodeCache.del(`favoriteNotes_${decoded.id}`);
    return apiResponse(true, "Note updated successfully", 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
