import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

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

  const { email, firstName, lastName, gender, team, organizationId } = req.body;

  try {
    // Check if the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return res.status(400).json({ message: "Invalid Organization ID" });
    }

    // Create user in Cognito
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
        { Name: "given_name", Value: firstName },
        { Name: "family_name", Value: lastName },
        { Name: "gender", Value: gender },
        { Name: "custom:organization_id", Value: organizationId },
      ],
      DesiredDeliveryMediums: ["EMAIL"],
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
        email,
        firstName,
        lastName,
        gender: gender.toUpperCase() as Gender,
        team,
        organizationId,
        role: "EMPLOYEE",
        status: "FORCE_CHANGE_PASSWORD",
        emailVerified: true,
        cognitoSub,
        organization: {
          connect: {
            id: organizationId,
          },
        },
      },
    });

    res.status(201).json({
      message:
        "User created successfully. A temporary password has been sent to the user's email.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
