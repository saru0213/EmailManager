import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  await redis.set("test:key", "Hello Redis", { ex: 60 });
  const value = await redis.get("test:key");

  return NextResponse.json({ value });
}
