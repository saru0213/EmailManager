import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req) {
  try {
    const body = await req.json();
    const token = body?.token;

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    const data = await redis.get(`invite:${token}`);

    if (!data) {
      return NextResponse.json(
        { error: "Invite link expired or invalid" },
        { status: 401 }
      );
    }

 
    return NextResponse.json(data);
  } catch (err) {
    console.error("Invite validate error:", err);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
