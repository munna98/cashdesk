// pages/api/reports/agent-summary.ts
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

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { startDate, endDate, agentId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    const start = new Date(startDate as string);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);

    // Build agent filter
    const agentFilter: any = {};
    if (agentId) {
      agentFilter._id = agentId;
    }

    // Get all agents
    const agents = await Agent.find(agentFilter);
    const agentSummaries = [];

    for (const agent of agents) {
      // Find agent's account
      const agentAccount = await Account.findOne({
        linkedEntityType: "agent",
        linkedEntityId: agent._id,
      });

      if (!agentAccount) continue;

      // Calculate opening balance (before start date)
      const priorTransactions = await Transaction.find({
        $or: [
          { debitAccount: agentAccount._id },
          { creditAccount: agentAccount._id },
        ],
        date: { $lt: start },
      });

      let openingBalance = agentAccount.openingBalance || 0;
      priorTransactions.forEach((txn) => {
        if (txn.debitAccount.toString() === agentAccount._id.toString()) {
          openingBalance -= txn.amount;
        } else {
          openingBalance += txn.amount;
        }
      });

      // Get period transactions
      const periodTransactions = await Transaction.find({
        $or: [
          { debitAccount: agentAccount._id },
          { creditAccount: agentAccount._id },
        ],
        date: { $gte: start, $lte: end },
      });

      let totalReceipts = 0;
      let totalPayments = 0;
      let totalCommission = 0;

      periodTransactions.forEach((txn) => {
        if (txn.type === "receipt" && txn.creditAccount.toString() === agentAccount._id.toString()) {
          totalReceipts += txn.amount;
          totalCommission += txn.commissionAmount || 0;
        } else if (txn.type === "journalentry") {
          if (txn.debitAccount.toString() === agentAccount._id.toString()) {
            // Could be commission deduction or payment clearing
            const isCommission = txn.note?.toLowerCase().includes("commission");
            if (isCommission) {
              totalCommission += txn.amount;
            } else {
              totalPayments += txn.amount;
            }
          }
        }
      });

      const closingBalance = openingBalance + totalReceipts - totalPayments - totalCommission;

      agentSummaries.push({
        _id: agent._id,
        name: agent.name,
        openingBalance,
        totalReceipts,
        totalPayments,
        totalCommission,
        closingBalance,
        transactionCount: periodTransactions.length,
      });
    }

    res.status(200).json(agentSummaries);
  } catch (error: any) {
    console.error("Error generating agent summary:", error);
    res.status(500).json({ error: error.message });
  }
}