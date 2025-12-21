import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    const { email, password, name, appPassword } = await req.json();

    if (!email || !password || !name || !appPassword) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    if (!/^[a-z]{16}$/.test(appPassword)) {
      return new Response(
        JSON.stringify({
          error: "App Password must be exactly 16 lowercase letters (a–z)",
        }),
        { status: 400 }
      );
    }

    const usersRef = collection(db, "users");

    const emailQuery = query(
      usersRef,
      where("email", "==", email.toLowerCase())
    );
    const existingUsers = await getDocs(emailQuery);

    if (!existingUsers.empty) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 400 }
      );
    }

    const appPassQuery = query(
      usersRef,
      where("appPassword", "==", appPassword)
    );
    const appPassUsers = await getDocs(appPassQuery);

    if (!appPassUsers.empty) {
      return new Response(
        JSON.stringify({
          error: "This App Password is already in use by another account",
        }),
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const docRef = await addDoc(usersRef, {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      appPassword,
      createdAt: new Date().toISOString(),
    });

    await updateDoc(docRef, { userId: docRef.id });

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
