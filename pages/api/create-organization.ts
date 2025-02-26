import prisma from "@/lib/prisma";
import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";
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

  // Remove the current user check for the start free trial flow
  // const currentUser = await getCurrentUser(req)
  // if (!currentUser) {
  //   return res.status(401).json({ message: "Unauthorized" })
  // }

  const {
    firstName,
    lastName,
    email,
    companyName,
    companyIndustry,
    companySize,
    companyCountry,
    companyCity,
    companyPhoneNumber,
    gender,
  } = req.body;

  try {
    // Generate organizationId
    const organizationId = `${companyName
      .replace(/\s+/g, "-")
      .toLowerCase()}-${Math.random().toString(36).substr(2, 6)}`;

    // Calculate trialEndDate (3 months from now)
    const trialEndDate = addMonths(new Date(), 3);

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
        trialEndDate: trialEndDate,
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
        trialEndDate: trialEndDate,
        trialStatus: "ACTIVE",
      },
    });

    res.status(201).json({
      message:
        "Organization, admin user, and customer record created successfully",
      organizationId,
      userId: user.id,
      customerId: customer.id,
      trialEndDate: trialEndDate,
    });
  } catch (error) {
    console.error("Error creating organization, user, and customer:", error);
    res
      .status(500)
      .json({ message: "Error creating organization, user, and customer" });
  }
}
