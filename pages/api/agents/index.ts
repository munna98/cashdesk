// pages/api/agents/index.ts - Updated with Opening Balance Journal
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Agent from "@/models/Agent";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";
import Counter from "@/models/Counter";

async function getNextSequence(name: string) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

function generateTransactionNumber(type: string, seq: number) {
  const year = new Date().getFullYear();
  let prefix = "JNL";
  return `${prefix}-${year}-${seq.toString().padStart(5, "0")}`;
}

async function calculateAccountBalance(accountId: string) {
  const account = await Account.findById(accountId);
  if (!account) return 0;

  const transactions = await Transaction.find({
    $or: [
      { debitAccount: accountId },
      { creditAccount: accountId }
    ]
  });

  let balance = 0;

  transactions.forEach((txn) => {
    const isDebited = txn.debitAccount.toString() === accountId;
    const isCredited = txn.creditAccount.toString() === accountId;

    if (isDebited) {
      balance += txn.amount;
    } else if (isCredited) {
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
        
        const agentIds = agents.map(a => a._id);
        const accounts = await Account.find({
          linkedEntityType: 'agent',
          linkedEntityId: { $in: agentIds }
        });
        
        const accountMap = new Map();
        accounts.forEach(acc => {
          accountMap.set(acc.linkedEntityId.toString(), acc);
        });
        
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
        
        // Create the associated account WITH opening balance stored for reference
        const account = await Account.create({
          name: req.body.name,
          type: 'agent',
          linkedEntityType: 'agent',
          linkedEntityId: agent._id,
          openingBalance: openingBalance, // ✅ Store for display purposes
          balance: 0 // Will be calculated from transactions
        });
        
        // ✅ NEW: If opening balance exists, create journal entry
        if (openingBalance && openingBalance !== 0) {
          const openingBalanceAccount = await Account.findOne({
            name: "Opening Balance",
            type: "equity"
          });

          if (!openingBalanceAccount) {
            await Agent.findByIdAndDelete(agent._id);
            await Account.findByIdAndDelete(account._id);
            return res.status(400).json({
              error: "Opening Balance account not found. Please contact support."
            });
          }

          const journalSeq = await getNextSequence("journalentry");
          const journalNumber = generateTransactionNumber("journalentry", journalSeq);

          // Create Journal Entry: Dr Opening Balance | Cr Agent
          // (Since agent balance is credit normal - they owe us)
          await Transaction.create({
            transactionNumber: journalNumber,
            debitAccount: openingBalanceAccount._id,  // Opening Balance (Dr)
            creditAccount: account._id,                // Agent Account (Cr)
            amount: Math.abs(openingBalance),
            date: new Date(),
            note: `Opening balance for ${req.body.name}`,
            type: "journalentry",
          });
        }
        
        return res.status(201).json({
          agent,
          account
        });
      } catch (err: any) {
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