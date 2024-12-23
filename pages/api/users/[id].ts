import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminDeleteUserCommand,
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
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { email, role, gender, lastName, firstName, team } = req.body;
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user in Cognito
      const updateUserCommand = new AdminUpdateUserAttributesCommand({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
        Username: user.cognitoUsername || user.email,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "gender", Value: gender },
          { Name: "family_name", Value: lastName },
          { Name: "given_name", Value: firstName },
          { Name: "custom:team", Value: team || "" },
        ],
      });

      await cognitoClient.send(updateUserCommand);

      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { email, role, gender, lastName, firstName, team },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  } else if (req.method === "DELETE") {
    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete user from Cognito
      const deleteUserCommand = new AdminDeleteUserCommand({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
        Username: user.cognitoUsername || user.email,
      });

      await cognitoClient.send(deleteUserCommand);

      // Delete user from database
      await prisma.user.delete({ where: { id: Number(id) } });

      res.status(204).end();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
