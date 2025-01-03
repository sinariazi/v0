import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import csv from "csv-parser";
import prisma from "@/lib/prisma";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";

export const config = {
  api: {
    bodyParser: false,
  },
};

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: fromEnv(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Received import users request");
  console.log("Request method:", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get the admin user's email from the request
  const adminEmail = req.headers["x-admin-email"] as string;
  if (!adminEmail) {
    console.error("Admin email is missing from the request headers");
    return res.status(400).json({ message: "Admin email is required" });
  }

  console.log("Admin email:", adminEmail);

  // Get the admin user's organization ID
  let adminOrganizationId: string;
  try {
    adminOrganizationId = await getAdminOrganizationId(adminEmail);
    console.log("Admin organization ID:", adminOrganizationId);
  } catch (error) {
    console.error("Error getting admin organization ID:", error);
    return res
      .status(500)
      .json({ message: "Failed to get admin organization ID" });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ message: "Error parsing form data" });
    }

    console.log("Parsed form fields:", fields);
    console.log("Parsed form files:", files);

    const file = files.file;
    if (!file || (Array.isArray(file) && file.length === 0)) {
      console.error("No file uploaded or invalid file structure");
      return res
        .status(400)
        .json({ message: "No file uploaded or invalid file structure" });
    }

    const fileToProcess = Array.isArray(file) ? file[0] : file;

    if (!fileToProcess || typeof fileToProcess !== "object") {
      console.error("Invalid file object");
      return res.status(400).json({ message: "Invalid file object" });
    }

    if (!fileToProcess.originalFilename) {
      console.error("Original filename is missing");
      return res.status(400).json({ message: "Original filename is missing" });
    }

    const fileExtension = fileToProcess.originalFilename
      .split(".")
      .pop()
      ?.toLowerCase();

    if (fileExtension !== "csv") {
      console.error("Invalid file type:", fileExtension);
      return res.status(400).json({ message: "Only CSV files are supported" });
    }

    if (!fileToProcess.filepath) {
      console.error("File path is missing");
      return res.status(400).json({ message: "File path is missing" });
    }

    try {
      console.log("Attempting to parse CSV file:", fileToProcess.filepath);
      const users = await parseCSV(fileToProcess.filepath);
      console.log("Parsed CSV data:", JSON.stringify(users, null, 2));
      const importResult = await importUsers(users, adminEmail);
      return res.status(200).json(importResult);
    } catch (error) {
      console.error("Unhandled error during import process:", error);
      return res
        .status(500)
        .json({
          message: "An unexpected error occurred during the import process",
          error: error instanceof Error ? error.message : "Unknown error",
        });
    } finally {
      // Clean up the temporary file
      fs.unlink(fileToProcess.filepath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    }
  });
}

async function getAdminOrganizationId(adminEmail: string): Promise<string> {
  const command = new AdminGetUserCommand({
    UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
    Username: adminEmail,
  });

  const response = await cognitoClient.send(command);
  const organizationIdAttribute = response.UserAttributes?.find(
    (attr) => attr.Name === "custom:organization_id"
  );

  if (!organizationIdAttribute || !organizationIdAttribute.Value) {
    throw new Error("Admin user does not have an organization ID");
  }

  return organizationIdAttribute.Value;
}

async function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapValues: ({ header, value }) => value.trim(),
        })
      )
      .on("data", (data) => {
        // Validate required fields
        if (!data.email || !data.firstName || !data.lastName) {
          reject(new Error("Missing required fields in CSV"));
          return;
        }
        results.push(data);
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

async function importUsers(
  users: any[],
  adminEmail: string
): Promise<{ message: string; importedCount: number; errors: string[] }> {
  let importedCount = 0;
  const errors: string[] = [];

  // Get the admin's organization ID
  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { organizationId: true },
  });

  if (!adminUser) {
    throw new Error("Admin user not found");
  }

  const organizationId = adminUser.organizationId;

  for (const user of users) {
    try {
      // Validate email format
      if (!user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push(`Invalid email format for user: ${user.email}`);
        continue;
      }

      // Create user in Cognito
      const userAttributes = [
        { Name: "email", Value: user.email },
        { Name: "given_name", Value: user.firstName },
        { Name: "family_name", Value: user.lastName },
        { Name: "gender", Value: user.gender || "OTHER" },
        { Name: "custom:organization_id", Value: organizationId },
      ];

      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
        Username: user.email,
        UserAttributes: userAttributes,
        TemporaryPassword: "ChangeMe123!",
      });

      console.log("Creating user in Cognito:", user.email);
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

      console.log("User created in Cognito:", user.email, "Sub:", cognitoSub);

      // Create user in database
      console.log("Creating user in database:", user.email);
      await prisma.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: (user.role as "EMPLOYEE" | "MANAGER" | "ADMIN") || "EMPLOYEE",
          gender: user.gender || "OTHER",
          team: user.team,
          cognitoSub,
          cognitoUsername: user.email,
          organizationId: organizationId,
          status: "FORCE_CHANGE_PASSWORD",
          emailVerified: false,
        },
      });

      console.log("User created in database:", user.email);
      importedCount++;
    } catch (error) {
      console.error(`Error importing user ${user.email}:`, error);
      errors.push(
        `Failed to import user ${user.email}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  const message =
    importedCount > 0
      ? `Successfully imported ${importedCount} users${
          errors.length > 0 ? " with some errors" : ""
        }.`
      : "No users were imported successfully.";

  return { message, importedCount, errors };
}
