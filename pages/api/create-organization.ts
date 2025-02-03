import prisma from "@/lib/prisma";
import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";
import { NextApiRequest, NextApiResponse } from "next";

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

  const {
    firstName,
    lastName,
    email,
    companyName,
    companyIndustry,
    companySize,
    companyCountry,
    companyCity,
    companyStreet,
    companyPhoneNumber,
    gender,
  } = req.body;

  try {
    // Generate organizationId
    const organizationId = `${companyName
      .replace(/\s+/g, "-")
      .toLowerCase()}-${Math.random().toString(36).substr(2, 6)}`;

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        id: organizationId,
        name: companyName,
        industry: companyIndustry,
        size: companySize,
        country: companyCountry.toLowerCase(),
        city: companyCity.toLowerCase(),
        email: email,
        phoneNumber: companyPhoneNumber,
      },
    });

    // Create user in Cognito
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "given_name", Value: firstName },
        { Name: "family_name", Value: lastName },
        { Name: "gender", Value: gender },
        { Name: "custom:organization_id", Value: organizationId },
      ].filter((attr) => attr.Value),
      TemporaryPassword: "ChangeMe123!",
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
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        role: "ADMIN",
        gender,
        cognitoSub,
        cognitoUsername: email,
        organizationId: organization.id,
        status: "FORCE_CHANGE_PASSWORD",
        emailVerified: false,
      },
    });

    // Create customer record
    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        subscriptionStatus: "TRIAL",
        subscriptionPlan: "FREE_TRIAL",
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    res.status(201).json({
      message:
        "Organization, admin user, and customer record created successfully",
      organizationId,
      userId: user.id,
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Error creating organization, user, and customer:", error);
    res
      .status(500)
      .json({ message: "Error creating organization, user, and customer" });
  }
}
