import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const csvContent = `email,firstName,lastName,role,gender,team
john.doe@example.com,John,Doe,EMPLOYEE,MALE,Engineering
jane.smith@example.com,Jane,Smith,MANAGER,FEMALE,Marketing
alex.johnson@example.com,Alex,Johnson,ADMIN,OTHER,HR`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=sample_users.csv");
  res.status(200).send(csvContent);
}
