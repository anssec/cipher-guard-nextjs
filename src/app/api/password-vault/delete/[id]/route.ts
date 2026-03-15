import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import passwordVault from "@/lib/models/passwordVault";
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

    const { id } = await params;
    const user = await User.findById(decoded.id);

    if (!user.passwordVault.some((pwId: { toString: () => string }) => pwId.toString() === id)) {
      return apiResponse(false, "Not authorized to delete this password", 403);
    }

    await passwordVault.findByIdAndDelete(id);
    await User.findByIdAndUpdate(decoded.id, { $pull: { passwordVault: id } });
    nodeCache.del(`getSavedPasswd_${decoded.id}`);
    return apiResponse(true, "Password delete successfully", 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
