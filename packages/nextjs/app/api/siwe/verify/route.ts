import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json();

    const siweMessage = new SiweMessage(message);
    const { data: messageData } = await siweMessage.verify({
      signature,
      domain: request.headers.get("host") || "",
      nonce: process.env.SIWE_NONCE_SECRET || "",
    });

    // Here you can store the session or user data
    // For now, just return success

    return NextResponse.json({
      ok: true,
      address: messageData.address,
    });
  } catch (error: any) {
    console.error("SIWE verification failed:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 400 }
    );
  }
}