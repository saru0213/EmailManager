import jwt from "jsonwebtoken";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { userId, email, appPassword } = decoded;

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return NextResponse.json(
      {
        userId,
        email,
        appPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
