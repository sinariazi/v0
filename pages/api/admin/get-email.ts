import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUserServer } from "@/lib/auth-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = await getCurrentUserServer();
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const email = user.attributes.email;

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.status(200).json({ email });
  } catch (error) {
    console.error("Error getting admin email:", error);
    res.status(500).json({ message: "Error getting admin email" });
  }
}
