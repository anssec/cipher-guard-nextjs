import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import UniquePasswd from "@/lib/models/uniquepasswd";
import { verifyToken, verifyIsUser } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";

const VALID_TYPES = new Set(["capital", "small", "special", "number"]);

const uniquePassWdGenerator = (options: string, length: number) => {
  let result = "";
  const characters = options.split("+").filter(Boolean).reduce((acc, type) => {
    switch (type) {
      case "capital": return acc + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      case "small": return acc + "abcdefghijklmnopqrstuvwxyz";
      case "special": return acc + "!@#$%^&*";
      case "number": return acc + "0123456789";
      default: return acc;
    }
  }, "");

  if (!characters.length) return "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);

    const { capital, small, special, number, length } = await req.json();

    // Validate at least one type is selected
    const selectedTypes = [capital, small, special, number].filter(Boolean);
    if (selectedTypes.length === 0) {
      return apiResponse(false, "Choose at least one option", 422);
    }

    // Validate all provided types are valid
    if (!selectedTypes.every((t: string) => VALID_TYPES.has(t))) {
      return apiResponse(false, "Choose a correct password type", 422);
    }

    if (typeof length !== "number" || length < 5 || length > 128) {
      return apiResponse(false, "Length should be between 5 to 128", 422);
    }

    // Generate unique password — use findOne instead of loading entire collection
    let generatedPassword: string;
    let attempts = 0;
    const MAX_ATTEMPTS = 10;
    do {
      generatedPassword = uniquePassWdGenerator(`${capital || ""}+${small || ""}+${special || ""}+${number || ""}`, length);
      const existing = await UniquePasswd.findOne({ passwd: generatedPassword });
      if (!existing) break;
      attempts++;
    } while (attempts < MAX_ATTEMPTS);

    await UniquePasswd.create({ passwd: generatedPassword });
    return apiResponse(true, "password generated", 200, generatedPassword);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
