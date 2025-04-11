// /pages/api/agents/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Agent from "@/models/Agent";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const agent = await Agent.findById(id);
        if (!agent) return res.status(404).json({ message: "Agent not found" });
        return res.status(200).json(agent);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    case "PUT":
      try {
        const updated = await Agent.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: "Agent not found" });
        return res.status(200).json(updated);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    case "DELETE":
      try {
        const deleted = await Agent.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Agent not found" });
        return res.status(200).json({ message: "Agent deleted successfully" });
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
