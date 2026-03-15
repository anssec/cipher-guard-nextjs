import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import secureNotes from "@/lib/models/secureNotes";
import CryptoJS from "crypto-js";
import { verifyToken, verifyIsUser, decryptVaultPin } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";
import nodeCache from "@/lib/utils/nodeCache";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);
    const vaultPin = decryptVaultPin(req);
    if (!vaultPin) return apiResponse(false, "Enter Vault Pin", 401);

    const { name, note, favorite, lockNote } = await req.json();
    if (!name) return apiResponse(false, "enter note name", 422);
    if (!note) return apiResponse(false, "note will not be empty", 422);

    const user = await User.findById(decoded.id);

    const createNoteInDB = async (noteName: string, noteContent: string, encrypt: boolean) => {
      const newNote = await secureNotes.create({
        name: noteName, notes: noteContent,
        favorite: favorite ? true : false, encrypt, email: decoded.email,
      });
      await User.findByIdAndUpdate(user._id, { $push: { secureNotes: newNote._id } }, { new: true });
    };

    if (lockNote === true) {
      const encryptNote = CryptoJS.AES.encrypt(note, vaultPin).toString();
      await createNoteInDB(name, encryptNote, true);
    } else {
      await createNoteInDB(name, note, false);
    }

    nodeCache.del(`getAllNote_${decoded.id}`);
    nodeCache.del(`favoriteNotes_${decoded.id}`);
    return apiResponse(true, "Note added successfully", 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
