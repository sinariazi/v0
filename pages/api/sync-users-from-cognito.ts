import { NextApiRequest, NextApiResponse } from "next";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";
import prisma from "@/lib/prisma";

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
      const givenName = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "given_name"
      )?.Value;
      const familyName = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "family_name"
      )?.Value;
      const gender = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "gender"
      )?.Value;
      const organizationId = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "custom:organization_id"
      )?.Value;

      if (email && sub) {
        await prisma.user.upsert({
          where: { cognitoSub: sub },
          update: {
            email,
            firstName: givenName || "",
            lastName: familyName || "",
            gender: (gender as "MALE" | "FEMALE" | "OTHER") || "OTHER",
            cognitoUsername: cognitoUser.Username || "",
            status: cognitoUser.UserStatus as
              | "UNCONFIRMED"
              | "CONFIRMED"
              | "ARCHIVED"
              | "COMPROMISED"
              | "UNKNOWN"
              | "RESET_REQUIRED"
              | "FORCE_CHANGE_PASSWORD",
            organizationId: organizationId || "default-org-id",
          },
          create: {
            email,
            firstName: givenName || "",
            lastName: familyName || "",
            gender: (gender as "MALE" | "FEMALE" | "OTHER") || "OTHER",
            cognitoSub: sub,
            cognitoUsername: cognitoUser.Username || "",
            role: "EMPLOYEE",
            status: cognitoUser.UserStatus as
              | "UNCONFIRMED"
              | "CONFIRMED"
              | "ARCHIVED"
              | "COMPROMISED"
              | "UNKNOWN"
              | "RESET_REQUIRED"
              | "FORCE_CHANGE_PASSWORD",
            organizationId: organizationId || "default-org-id",
          },
        });
        syncedCount++;
      }
    }

    res
      .status(200)
      .json({
        message: `Synced ${syncedCount} users from Cognito to the database.`,
      });
  } catch (error) {
    console.error("Error syncing users from Cognito:", error);
    res.status(500).json({ message: "Error syncing users from Cognito" });
  }
}
