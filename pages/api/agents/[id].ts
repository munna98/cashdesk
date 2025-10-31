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

        // Fetch linked account for opening balance
        const account = await Account.findOne({
          linkedEntityId: id,
          linkedEntityType: "agent",
        });

        const agentWithBalance = {
          ...agent.toObject(),
          openingBalance: account?.openingBalance || 0,
          balance: account?.balance || 0,
        };

        return res.status(200).json(agentWithBalance);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }


    case "PUT":
      try {
        const { openingBalance, name, ...agentData } = req.body;

        // Update agent
        const updatedAgent = await Agent.findByIdAndUpdate(
          id,
          { ...agentData, ...(name ? { name } : {}) },
          { new: true, runValidators: true }
        );

        if (!updatedAgent) {
          return res.status(404).json({ message: "Agent not found" });
        }

        // Find linked account
        const account = await Account.findOne({
          linkedEntityId: id,
          linkedEntityType: "agent",
        });

        if (account) {
          const updateData: Record<string, any> = {};

          // If name changed, sync it
          if (name) updateData.name = name;

          // If opening balance provided, handle update carefully
          if (openingBalance !== undefined) {
            const transactionCount = await Transaction.countDocuments({
              agentId: id,
            });

            updateData.openingBalance = Number(openingBalance);

            // If no transactions exist, we can safely reset balance
            if (transactionCount === 0) {
              updateData.balance = Number(openingBalance);
            }
          }

          // Update account if there's something to change
          if (Object.keys(updateData).length > 0) {
            await Account.findByIdAndUpdate(account._id, updateData);
          }
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
