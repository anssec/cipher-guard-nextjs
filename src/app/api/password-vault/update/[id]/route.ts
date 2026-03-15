import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import passwordVault from "@/lib/models/passwordVault";
import CryptoJS from "crypto-js";
import { verifyToken, verifyIsUser, decryptVaultPin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";
import { formatDate } from "@/lib/utils/dateFormatter";
import nodeCache from "@/lib/utils/nodeCache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);
    const vaultPin = decryptVaultPin(req);
    if (!vaultPin) return apiResponse(false, "Enter Vault Pin", 401);

    const { id } = await params;
    const { name, username, password, website } = await req.json();

    const user = await User.findById(decoded.id);
    if (!user.passwordVault.some((pwId: { toString: () => string }) => pwId.toString() === id)) {
      return apiResponse(false, "Not authorized to update this password", 403);
    }

    const currentDate = formatDate();

    const updateData: Record<string, string | number> = { Updated: currentDate };
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (password) {
      updateData.password = CryptoJS.AES.encrypt(password, vaultPin).toString();
      updateData.passwordUpdated = currentDate;
    }
    if (website) updateData.website = website;

    const updatedPassword = await passwordVault.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedPassword) return apiResponse(false, "Password not found", 404);

    updatedPassword.passwordHistory += 1;
    await updatedPassword.save();
    nodeCache.del(`getSavedPasswd_${decoded.id}`);
    return apiResponse(true, "Password Updated", 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
