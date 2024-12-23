import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";
import { Prisma } from "@prisma/client";

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
      const { email, role, gender, lastName, firstName, team, organizationId } =
        req.body;
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the organization exists, if not create it
      const organization = await prisma.organization.upsert({
        where: { id: organizationId },
        update: {},
        create: { id: organizationId, name: `Organization ${organizationId}` },
      });

      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          email,
          role,
          gender,
          lastName,
          firstName,
          team,
          organizationId: organization.id,
        },
      });

      // Update user in Cognito
      const updateUserCommand = new AdminUpdateUserAttributesCommand({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
        Username: user.cognitoUsername || user.email,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "given_name", Value: firstName },
          { Name: "family_name", Value: lastName },
          { Name: "gender", Value: gender },
          { Name: "custom:organization_id", Value: organizationId },
          ...(team ? [{ Name: "custom:team", Value: team }] : []),
        ],
      });

      await cognitoClient.send(updateUserCommand);

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res
          .status(400)
          .json({ message: "Error updating user", error: error.message });
      } else {
        res
          .status(500)
          .json({
            message: "Error updating user",
            error: "An unexpected error occurred",
          });
      }
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
    } catch (error: unknown) {
      console.error("Error deleting user:", error);
      let errorMessage =
        "An unexpected error occurred while deleting the user.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res
        .status(500)
        .json({ message: "Error deleting user", error: errorMessage });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
