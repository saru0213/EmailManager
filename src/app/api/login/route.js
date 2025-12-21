import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    const { email, password, appPassword } = await req.json();

    if (!email || !password || !appPassword) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase()));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
   
      return new Response(
        JSON.stringify({ error: "User with this email does not exist. Please sign up." }),
        { status: 400 }
      );
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400 }
      );
    }

    if (!user.appPassword) {
      const hashedAppPassword = await bcrypt.hash(appPassword, 10);
      await updateDoc(doc(db, "users", userDoc.id), {
        appPassword: hashedAppPassword,
      });
    } else {
      const isAppPassMatch = await bcrypt.compare(
        appPassword,
        user.appPassword
      );
      if (!isAppPassMatch) {
        return new Response(JSON.stringify({ error: "Invalid App Password" }), {
          status: 400,
        });
      }
    }

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
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
