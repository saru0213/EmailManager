import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
   
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "No token provided" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    const { userId, email } = decoded;

    return new Response(JSON.stringify({ userId, email }), { status: 200 });
  } catch (err) {
    console.error("Error in /api/user:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
