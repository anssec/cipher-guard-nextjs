import { NextResponse } from "next/server";

export function apiResponse(
  success: boolean,
  message: string | null,
  status: number,
  data: unknown = null
) {
  return NextResponse.json(
    {
      success,
      message: message ?? undefined,
      data: data ?? undefined,
    },
    { status }
  );
}
