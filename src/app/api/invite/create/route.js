import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    const expiresIn = process.env.NEXT_PUBLIC_EXPIRE_TIME;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const token = crypto.randomBytes(24).toString("hex");

    const TTL = Number(expiresIn) * 60;

    await redis.set(`invite:${token}`, JSON.stringify({ userId }), { ex: TTL });

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/contacts/create?token=${token}`;

    return NextResponse.json({
      link,
      expiresIn: `${Number(expiresIn)} hour`,
    });
  } catch (err) {
    console.error("Invite API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
