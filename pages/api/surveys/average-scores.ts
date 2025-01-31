import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { configureAmplify } from "@/lib/amplify-config";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import jwt from "jsonwebtoken";

configureAmplify();

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;
    try {
      await verifier.verify(token);
      decodedToken = jwt.decode(token);
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    if (!decodedToken || typeof decodedToken === "string") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const cognitoSub = decodedToken.sub;

    const user = await prisma.user.findUnique({
      where: { cognitoSub },
      select: { organizationId: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    const averageScores = await prisma.averageEngagementScore.findMany({
      where: { organizationId: user.organizationId },
      select: { factor: true, averageScore: true },
    });

    // Set cache headers
    res.setHeader(
      "Cache-Control",
      "public, max-age=60, s-maxage=60, stale-while-revalidate=300"
    );
    res.status(200).json({ scores: averageScores });
  } catch (error) {
    console.error("Error fetching average scores:", error);
    res.status(500).json({ message: "Error fetching average scores" });
  }
}
