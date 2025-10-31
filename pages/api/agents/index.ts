// /pages/api/agents/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Agent from "@/models/Agent";
import Account from "@/models/Account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const agents = await Agent.find({});
        
        // Get all agent accounts to include balance info
        const agentIds = agents.map(a => a._id);
        const accounts = await Account.find({
          linkedEntityType: 'agent',
          linkedEntityId: { $in: agentIds }
        });
        
        // Map accounts to agents
        const accountMap = new Map();
        accounts.forEach(acc => {
          accountMap.set(acc.linkedEntityId.toString(), acc);
        });
        
        // Add balance to each agent
        const agentsWithBalance = agents.map(agent => {
          const account = accountMap.get(agent._id.toString());
          return {
            ...agent.toObject(),
            balance: account?.balance || 0
          };
        });
        
        return res.status(200).json(agentsWithBalance);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }


    case "POST":
      try {
        const { openingBalance = 0, ...agentData } = req.body;
        
        // Create the agent first
        const agent = await Agent.create(agentData);
        
        // Create the associated account with opening balance
        const account = await Account.create({
          name: req.body.name,
          type: 'agent',
          linkedEntityType: 'agent',
          linkedEntityId: agent._id,
          openingBalance: Number(-openingBalance),
          balance: Number(-openingBalance) // Initialize balance with opening balance
        });
        
        return res.status(201).json({
          agent,
          account
        });
      } catch (err: any) {
        // Cleanup on error
        if (req.body._id) {
          try {
            await Agent.findByIdAndDelete(req.body._id);
          } catch (cleanupErr) {
            console.error("Failed to clean up agent after error:", cleanupErr);
          }
        }
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}