import prisma from "@/lib/prisma";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";
import type { Gender, UserStatus } from "@prisma/client";
import { addMonths } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: fromEnv(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Ensure default organization exists
    const defaultOrg = await prisma.organization.upsert({
      where: { id: "default-org-id" },
      update: {},
      create: {
        id: "default-org-id",
        name: "Default Organization",
        industry: "Other",
        size: "1-10",
        country: "Unknown",
        city: "Unknown",
        email: "unknown@example.com",
        trialEndDate: addMonths(new Date(), 3), // Add this line to include trialEndDate
      },
    });

    const command = new ListUsersCommand({
      UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
    });

    const cognitoUsers = await cognitoClient.send(command);

    let syncedCount = 0;
    for (const cognitoUser of cognitoUsers.Users || []) {
      const email = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "email"
      )?.Value;
      const sub = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "sub"
      )?.Value;
      const firstName =
        cognitoUser.Attributes?.find((attr) => attr.Name === "given_name")
          ?.Value || "";
      const lastName =
        cognitoUser.Attributes?.find((attr) => attr.Name === "family_name")
          ?.Value || "";
      const gender =
        (cognitoUser.Attributes?.find((attr) => attr.Name === "gender")
          ?.Value as Gender) || "OTHER";
      const team =
        cognitoUser.Attributes?.find((attr) => attr.Name === "custom:team")
          ?.Value || null;
      const userStatus = (cognitoUser.UserStatus as UserStatus) || "UNKNOWN";
      const cognitoUsername = cognitoUser.Username || "";

      if (email && sub) {
        await prisma.user.upsert({
          where: { cognitoSub: sub },
          update: {
            email,
            firstName,
            lastName,
            gender,
            team,
            cognitoUsername,
            status: userStatus,
          },
          create: {
            email,
            firstName,
            lastName,
            gender,
            team,
            cognitoSub: sub,
            cognitoUsername,
            role: "EMPLOYEE",
            organizationId: defaultOrg.id,
            status: userStatus,
          },
        });
        syncedCount++;
      }
    }

    res.status(200).json({
      message: `Users synced successfully. Synced ${syncedCount} users.`,
    });
  } catch (error) {
    console.error("Error syncing users:", error);
    res.status(500).json({
      message: `Error syncing users: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
  }
}
