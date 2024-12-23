import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
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
          family: true,
          gender: true,
          status: true,
          createdAt: true,
          role: true,
          team: true,
          cognitoSub: true,
          cognitoUsername: true,
          organization: {
            select: {
              name: true,
            },
          },
        },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, family, email, role, gender, team } = req.body;

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
          { Name: "family_name", Value: family },
          { Name: "gender", Value: gender },
          { Name: "custom:team", Value: team || "" },
        ],
        TemporaryPassword: "TemporaryPassword123!",
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
          name,
          family,
          email,
          role,
          gender,
          team,
          cognitoSub,
          cognitoUsername: email,
          organizationId: defaultOrg.id,
          status: "FORCE_CHANGE_PASSWORD",
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
