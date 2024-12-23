import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";

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
          name: true,
          role: true,
          cognitoSub: true,
          cognitoUsername: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email, role } = req.body;

      // Ensure default organization exists
      const defaultOrg = await prisma.organization.upsert({
        where: { id: "default-org-id" },
        update: {},
        create: {
          id: "default-org-id",
          name: "Default Organization",
        },
      });

      // Create user in Cognito
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
        ],
        TemporaryPassword: "TemporaryPassword123!", // You should generate a secure random password here
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
          name,
          email,
          role,
          cognitoSub,
          cognitoUsername: email,
          organizationId: defaultOrg.id,
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
