import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { email, role } = req.body;
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { email, role },
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.user.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
