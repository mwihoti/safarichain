import { NextResponse } from "next/server";
import { generateNonce } from "siwe";

export async function GET() {
  const nonce = generateNonce();
  return NextResponse.json({ nonce });
}


So when I comment on a tweet and click comment, a signup transaction should happen on metamask, can it be free without need of having gas fee or user having to pay anything they just need to sign and confirm, then the comment or like is onchain