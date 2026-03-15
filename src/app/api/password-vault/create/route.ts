import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import passwordVault from "@/lib/models/passwordVault";
import CryptoJS from "crypto-js";
import { verifyToken, verifyIsUser, decryptVaultPin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";
import { formatDate } from "@/lib/utils/dateFormatter";
import nodeCache from "@/lib/utils/nodeCache";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);
    const vaultPin = decryptVaultPin(req);
    if (!vaultPin) return apiResponse(false, "Enter Vault Pin", 401);

    const { username, password, website } = await req.json();
    if (!username || !password || !website) {
      return apiResponse(false, "Enter all fields", 422);
    }

    const extractDomain = (inputUrl: string) => {
      try {
        return new URL(inputUrl).hostname;
      } catch {
        return "Not define";
      }
    };

    const domain = extractDomain(website);
    const faviconFinder = () => {
      try {
        const faviconDomain = domain !== "Not define" ? domain : "";
        return `https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=64`;
      } catch {
        return "/defaultFavicon.png";
      }
    };

    const currentDate = formatDate();

    const encryptPasswd = CryptoJS.AES.encrypt(password, vaultPin).toString();

    const newPassword = await passwordVault.create({
      name: domain, username, password: encryptPasswd,
      website, websiteFavicon: faviconFinder(),
      Created: currentDate, email: decoded.email,
    });

    await User.findByIdAndUpdate(decoded.id, { $push: { passwordVault: newPassword._id } }, { new: true });
    nodeCache.del(`getSavedPasswd_${decoded.id}`);
    return apiResponse(true, "credential saved", 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log("here is the error", message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
