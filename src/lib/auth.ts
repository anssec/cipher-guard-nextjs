import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface DecodedToken {
  email: string;
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export async function verifyToken(
  req?: NextRequest
): Promise<DecodedToken | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token")?.value;
    const authHeader = req?.headers.get("authorization");
    const token =
      tokenCookie || (authHeader ? authHeader.replace("Bearer ", "") : null);

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedToken;
    return decoded;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log("Token verification error:", message);
    return null;
  }
}

export function verifyIsUser(decoded: DecodedToken): boolean {
  return decoded.role === "user";
}

export function verifyIsAdmin(decoded: DecodedToken): boolean {
  return decoded.role === "admin";
}

export function decryptVaultPin(req: NextRequest): string | null {
  try {
    const vaultAuth = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!vaultAuth) return null;
    const decoded = CryptoJS.AES.decrypt(
      vaultAuth,
      process.env.SECUREPIN!
    ).toString(CryptoJS.enc.Utf8);
    return decoded;
  } catch {
    return null;
  }
}

export async function verifyDataCookie(): Promise<DecodedToken | null> {
  try {
    const cookieStore = await cookies();
    const dataCookie = cookieStore.get("data")?.value;
    if (!dataCookie) return null;

    const decoded = jwt.verify(
      dataCookie,
      process.env.JWT_SECRET!
    ) as DecodedToken & { firstName: string; lastName: string; password: string };
    return decoded;
  } catch {
    return null;
  }
}
