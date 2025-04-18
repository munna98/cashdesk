// /pages/api/agents/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Agent from "@/models/Agent";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";

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
        const updatedAgent = await Agent.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!updatedAgent) {
          return res.status(404).json({ message: "Agent not found" });
        }

        // Update the corresponding account if agent name is changed
        if (req.body.name) {
          await Account.findOneAndUpdate(
            {
              linkedEntityId: id,
              linkedEntityType: "agent",
            },
            {
              name: req.body.name,
            }
          );
        }

        return res.status(200).json(updatedAgent);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    case "DELETE":
      try {
        // Prevent deleting agent with existing transactions
        const hasTransactions = await Transaction.exists({ agentId: id });
        if (hasTransactions) {
          return res.status(400).json({
            error: "Cannot delete agent with existing transactions.",
          });
        }

        // Delete the agent
        const deletedAgent = await Agent.findByIdAndDelete(id);
        if (!deletedAgent) {
          return res.status(404).json({ message: "Agent not found" });
        }

        // Delete linked account
        await Account.findOneAndDelete({
          linkedEntityId: id,
          linkedEntityType: "agent",
        });

        return res
          .status(200)
          .json({ message: "Agent and linked account deleted successfully" });
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
