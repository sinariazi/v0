import { NextApiRequest, NextApiResponse } from "next";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  MessageActionType,
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

  const { email, firstName, lastName, role, gender, team, organizationId } =
    req.body;

  try {
    // Check if the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return res
        .status(400)
        .json({ message: "Organization ID does not exist" });
    }

    // Create user in Cognito
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "given_name", Value: firstName },
        { Name: "family_name", Value: lastName },
        { Name: "gender", Value: gender },
        { Name: "custom:team", Value: team || "" },
        { Name: "custom:organization_id", Value: organizationId },
      ],
      DesiredDeliveryMediums: ["EMAIL"],
      ForceAliasCreation: false,
      // We don't set MessageAction here, so Cognito will send the default welcome message with temporary password
    });

    const cognitoResponse = await cognitoClient.send(createUserCommand);

    if (!cognitoResponse.User) {
      throw new Error("Failed to create user in Cognito");
    }

    const cognitoSub = cognitoResponse.User.Attributes?.find(
      (attr) => attr.Name === "sub"
    )?.Value;

    if (!cognitoSub) {
      throw new Error("Cognito sub not found in response");
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role,
        gender,
        team,
        cognitoSub,
        cognitoUsername: email,
        organizationId,
        status: "FORCE_CHANGE_PASSWORD",
        emailVerified: false,
      },
    });

    res.status(201).json({
      message:
        "User created successfully. A temporary password has been sent to the user's email.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
}
