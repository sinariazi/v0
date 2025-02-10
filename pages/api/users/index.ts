import { Gender, UserRole } from "@/components/user-management/types";
import prisma from "@/lib/prisma";
import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";
import type { NextApiRequest, NextApiResponse } from "next";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: fromEnv(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          gender: true,
          status: true,
          createdAt: true,
          role: true,
          team: true,
          cognitoSub: true,
          cognitoUsername: true,
          emailVerified: true,
          organizationId: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  } else if (req.method === "POST") {
    try {
      const { firstName, lastName, email, role, gender, team } = req.body as {
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
        gender: Gender;
        team?: string;
      };

      // Get the admin's organization ID
      const adminEmail = req.headers["x-admin-email"] as string;
      if (!adminEmail) {
        return res.status(400).json({ message: "Admin email is required" });
      }

      const adminUser = await prisma.user.findUnique({
        where: { email: adminEmail },
        select: { organizationId: true },
      });

      if (!adminUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }

      const organizationId = adminUser.organizationId;

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

      // Set permanent password for the user
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
        Username: email,
        Password: "ChangeMe123!",
        Permanent: true,
      });

      await cognitoClient.send(setPasswordCommand);

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

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
