import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing email or password" }),
        { status: 400 }
      );
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 400 }
      );
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

 
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400 }
      );
    }


    const appPassword = user.appPassword;

  
    const token = jwt.sign(
      {
        userId: userDoc.id,
        email: user.email,
        appPassword, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        user: {
          name: user.name,
          email: user.email,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
