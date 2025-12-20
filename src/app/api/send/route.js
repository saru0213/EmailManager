import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const {
      userId,
      to,
      subject,
      html,
      templateId,
      templateName,
      groupId,
      groupName,
    } = await request.json();

    if (!userId || !to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    await addDoc(collection(db, "sendlog"), {
      userId,
      to,
      subject,
      html,
      templateId: templateId || null,
      groupId: groupId || null,
      templateName: templateName || null,
      groupName: groupName || null,
      status: "sent",
      sentAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send mail error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
