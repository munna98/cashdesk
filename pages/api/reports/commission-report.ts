// pages/api/reports/commission-report.ts
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

    const agents = await Agent.find(agentFilter);
    const commissionData = [];

    for (const agent of agents) {
      const agentAccount = await Account.findOne({
        linkedEntityType: "agent",
        linkedEntityId: agent._id,
      });

      if (!agentAccount) continue;

      // Find commission transactions
      const commissionTransactions = await Transaction.find({
        $or: [
          {
            // Receipt transactions with commission
            type: "receipt",
            creditAccount: agentAccount._id,
            date: { $gte: start, $lte: end },
            commissionAmount: { $gt: 0 },
          },
          {
            // Commission journal entries
            type: "journalentry",
            debitAccount: agentAccount._id,
            date: { $gte: start, $lte: end },
            note: { $regex: /commission/i },
          },
        ],
      }).populate("debitAccount creditAccount");

      const totalCommission = commissionTransactions.reduce((sum, txn) => {
        if (txn.type === "receipt") {
          return sum + (txn.commissionAmount || 0);
        } else {
          return sum + txn.amount;
        }
      }, 0);

      const receiptCount = commissionTransactions.filter(
        (t) => t.type === "receipt"
      ).length;

      commissionData.push({
        _id: agent._id,
        name: agent.name,
        commPercent: agent.commPercent || 0,
        totalCommission,
        receiptCount,
        transactions: commissionTransactions,
      });
    }

    res.status(200).json(commissionData);
  } catch (error: any) {
    console.error("Error generating commission report:", error);
    res.status(500).json({ error: error.message });
  }
}