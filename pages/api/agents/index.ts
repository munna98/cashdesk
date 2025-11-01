// pages/api/agents/index.ts - FIXED
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Agent from "@/models/Agent";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";

async function calculateAccountBalance(accountId: string) {
  const account = await Account.findById(accountId);
  if (!account) return 0;

  // Get all transactions involving this account
  const transactions = await Transaction.find({
    $or: [
      { debitAccount: accountId },
      { creditAccount: accountId }
    ]
  });

  // Start with opening balance (negative for agent accounts)
  let balance = account.openingBalance || 0;

  // Process all transactions
  transactions.forEach((txn) => {
    const isDebited = txn.debitAccount.toString() === accountId;
    const isCredited = txn.creditAccount.toString() === accountId;

    if (isDebited) {
      // Account is debited - reduces the credit balance (agent owes less)
      balance += txn.amount;
    } else if (isCredited) {
      // Account is credited - increases the credit balance (agent owes more)
      balance -= txn.amount;
    }
  });

  return balance;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const agents = await Agent.find({});
        
        // Get all agent accounts
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
        
        // Calculate balance for each agent
        const agentsWithBalance = await Promise.all(
          agents.map(async (agent) => {
            const account = accountMap.get(agent._id.toString());
            let balance = 0;
            
            if (account) {
              balance = await calculateAccountBalance(account._id.toString());
            }
            
            return {
              ...agent.toObject(),
              balance
            };
          })
        );
        
        return res.status(200).json(agentsWithBalance);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }

    case "POST":
      try {
        const { openingBalance = 0, ...agentData } = req.body;
        
        // Create the agent first
        const agent = await Agent.create(agentData);
        
        // Create the associated account with NEGATIVE opening balance (credit balance)
        // Because agents typically have credit balances (they owe us money)
        const account = await Account.create({
          name: req.body.name,
          type: 'agent',
          linkedEntityType: 'agent',
          linkedEntityId: agent._id,
          openingBalance: -Number(openingBalance), // Negative = they owe us
          balance: -Number(openingBalance) // Will be recalculated
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