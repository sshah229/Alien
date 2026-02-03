import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { verifyToken, extractBearerToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get("Authorization");
    const token = extractBearerToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    // Verify the token with Alien SSO
    const tokenInfo = await verifyToken(token);
    const alienId = tokenInfo.sub;

    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(schema.users.alienId, alienId),
    });

    if (!user) {
      // Create new user on first auth
      const [newUser] = await db
        .insert(schema.users)
        .values({ alienId })
        .returning();
      user = newUser;
    } else {
      // Update last seen timestamp
      await db
        .update(schema.users)
        .set({ updatedAt: new Date() })
        .where(eq(schema.users.id, user.id));
    }

    return NextResponse.json({
      id: user.id,
      alienId: user.alienId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    // Handle JWT verification errors
    if (error instanceof Error) {
      if (
        error.message.includes("JWS") ||
        error.message.includes("JWT") ||
        error.message.includes("signature")
      ) {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        );
      }
    }

    console.error("Error in /api/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
