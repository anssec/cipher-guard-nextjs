import { NextRequest } from "next/server";
import { verifyToken, verifyIsUser } from "@/lib/auth";
import { apiResponse } from "@/lib/utils/response";
import { usernames } from "@/lib/utils/username";

function generateRandomUsernameWithNumber() {
  const randomIndex = Math.floor(Math.random() * usernames.length);
  const selectedUsername = usernames[randomIndex];
  const randomNumber = Math.floor(Math.random() * 99999);
  return `${selectedUsername}${randomNumber}`;
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded) return apiResponse(false, "Token Is missing", 401);
    if (!verifyIsUser(decoded)) return apiResponse(false, "only user access this route", 401);

    const randomGeneratedUsernames = generateRandomUsernameWithNumber();
    return apiResponse(true, "username generated", 200, randomGeneratedUsernames);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return apiResponse(false, "Internal server error Try Again", 500);
  }
}
