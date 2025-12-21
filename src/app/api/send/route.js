import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const {
      userId,
      fromEmail,
      appPassword,
      to,
      subject,
      html,
      templateId,
      templateName,
      groupId,
      groupName,
    } = await request.json();

    if (!userId || !fromEmail || !appPassword || !to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: fromEmail || process.env.EMAIL_USER,
        pass: appPassword || process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
    });

    await addDoc(collection(db, "sendlog"), {
      userId,
      fromEmail,
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
