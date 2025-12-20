import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import crypto from "crypto";

export async function POST(req) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }


  const token = crypto.randomBytes(24).toString("hex");


  const TTL = 1 * 60;

  await redis.set(`invite:${token}`, JSON.stringify({ userId }), { ex: TTL });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/contacts/create?token=${token}`;

  return NextResponse.json({
    link,
    expiresIn: "1 hour",
  });
}
