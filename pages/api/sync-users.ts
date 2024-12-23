import { NextApiRequest, NextApiResponse } from "next";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";
import prisma from "@/lib/prisma";
import { Gender, UserStatus } from "@prisma/client";

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

  console.log("Starting user sync...");
  console.log("AWS Region:", process.env.NEXT_PUBLIC_AWS_REGION);
  console.log("User Pool ID:", process.env.NEXT_PUBLIC_AWS_USER_POOL_ID);

  try {
    // Ensure default organization exists
    const defaultOrg = await prisma.organization.upsert({
      where: { id: "default-org-id" },
      update: {},
      create: {
        id: "default-org-id",
        name: "Default Organization",
      },
    });

    const command = new ListUsersCommand({
      UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
    });

    const cognitoUsers = await cognitoClient.send(command);

    console.log("Cognito users:", cognitoUsers);

    let syncedCount = 0;
    for (const cognitoUser of cognitoUsers.Users || []) {
      const email = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "email"
      )?.Value;
      const sub = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "sub"
      )?.Value;
      const name =
        cognitoUser.Attributes?.find((attr) => attr.Name === "name")?.Value ||
        "";
      const family =
        cognitoUser.Attributes?.find((attr) => attr.Name === "family_name")
          ?.Value || "";
      const gender =
        (cognitoUser.Attributes?.find((attr) => attr.Name === "gender")
          ?.Value as Gender) || "OTHER";
      const team =
        cognitoUser.Attributes?.find((attr) => attr.Name === "custom:team")
          ?.Value || null;

      if (email && sub) {
        await prisma.user.upsert({
          where: { cognitoSub: sub },
          update: {
            email,
            name,
            family,
            gender,
            team,
            cognitoUsername: cognitoUser.Username || "",
            status: (cognitoUser.UserStatus as UserStatus) || "UNKNOWN",
          },
          create: {
            email,
            name,
            family,
            gender,
            team,
            cognitoSub: sub,
            cognitoUsername: cognitoUser.Username || "",
            role: "EMPLOYEE",
            organizationId: defaultOrg.id,
            status: (cognitoUser.UserStatus as UserStatus) || "UNKNOWN",
          },
        });
        syncedCount++;
      }
    }

    res
      .status(200)
      .json({
        message: `Users synced successfully. Synced ${syncedCount} users.`,
      });
  } catch (error) {
    console.error("Error syncing users:", error);
    res
      .status(500)
      .json({
        message: `Error syncing users: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
  }
}
