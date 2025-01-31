import { NextApiRequest, NextApiResponse } from "next";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import prisma from "@/lib/prisma";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, firstName, lastName, team, organizationId } = req.body;

  try {
    // Check if the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return res.status(400).json({ message: "Invalid Organization ID" });
    }

    // Update user attributes in Cognito
    const updateUserAttributesCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: "given_name", Value: firstName },
        { Name: "family_name", Value: lastName },
        { Name: "custom:team", Value: team },
        { Name: "custom:organization_id", Value: organizationId },
      ],
    });

    await cognitoClient.send(updateUserAttributesCommand);

    // Update user in database
    await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        team,
        organizationId,
      },
    });

    res.status(200).json({ message: "User attributes updated successfully" });
  } catch (error) {
    console.error("Error updating user attributes:", error);
    res.status(500).json({
      message: "Error updating user attributes",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
