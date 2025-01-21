import type { NextApiRequest, NextApiResponse } from "next";
import { getDateRangeFilter } from "@/lib/date-utils";
import prisma from "@/lib/prisma";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { configureAmplify } from "@/lib/amplify-config";

configureAmplify();

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID!,
});

interface JwtPayload {
  sub: string;
  [key: string]: any;
}

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
    const payload = await verifier.verify(token);

    const user = await prisma.user.findUnique({
      where: { cognitoSub: payload.sub },
      select: { id: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    const range = req.query.range as string;
    const dateFilter = getDateRangeFilter(range);

    const factorScores = await prisma.surveyResponse.groupBy({
      by: ["factor"],
      where: {
        survey: {
          userId: user.id,
          createdAt: dateFilter,
        },
      },
      _avg: {
        score: true,
      },
    });

    const topFactors = factorScores
      .sort((a, b) => (b._avg.score || 0) - (a._avg.score || 0))
      .slice(0, 5)
      .map((factor) => ({
        factor: factor.factor,
        score: factor._avg.score || 0,
      }));

    res.status(200).json(topFactors);
  } catch (error) {
    console.error("Error in top-factors API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
