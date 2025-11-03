// pages/api/dashboard/index.ts - Updated to calculate opening from transactions
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Agent from "@/models/Agent";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";

interface AgentDashboardData {
  _id: string;
  name: string;
  opening: number;
  received: number;
  commission: number;
  paid: number;
  cancelled: number;
  closing: number;
}

interface DashboardSummary {
  totalOpeningBalance: number;
  totalReceived: number;
  totalCommission: number;
  totalPaid: number;
  totalCancelled: number;
  totalClosingBalance: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date as string) : new Date();
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const agents = await Agent.find({});
    const accounts = await Account.find({});

    // ✅ Get all transactions BEFORE the target date (for opening balance)
    const allTransactions = await Transaction.find({
      date: { $lt: startOfDay }
    }).select('debitAccount creditAccount amount type note');

    const todayTransactions = await Transaction.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('debitAccount', 'name type')
    .populate('creditAccount', 'name type');

    const agentDashboardData: AgentDashboardData[] = [];
    
    let totalOpeningBalance = 0;
    let totalReceived = 0;
    let totalCommission = 0;
    let totalPaid = 0;
    let totalCancelled = 0;

    for (const agent of agents) {
      const agentAccount = accounts.find(
        (acc: any) => 
          acc.type === "agent" && 
          acc.linkedEntityId?.toString() === agent._id.toString()
      );

      if (!agentAccount) continue;

      // ✅ Calculate opening balance: stored opening + transactions before target date
      let opening = agentAccount.openingBalance || 0;
      
      allTransactions.forEach((txn: any) => {
        const isDebited = txn.debitAccount?.toString() === agentAccount._id.toString();
        const isCredited = txn.creditAccount?.toString() === agentAccount._id.toString();

        if (isDebited) {
          opening -= txn.amount;  // Debit reduces credit balance (agent owes less)
        } else if (isCredited) {
          opening += txn.amount;  // Credit increases credit balance (agent owes more)
        }
      });

      // Filter today's transactions for this agent
      const agentReceipts = todayTransactions.filter(
        (t: any) => 
          t.type === "receipt" && 
          t.creditAccount?._id?.toString() === agentAccount._id.toString()
      );

      const agentCommissions = todayTransactions.filter(
        (t: any) => 
          t.type === "journalentry" &&
          t.debitAccount?._id?.toString() === agentAccount._id.toString() &&
          t.creditAccount?.type === "income" &&
          t.creditAccount?.name === "Commission"
      );

      const agentPayments = todayTransactions.filter(
        (t: any) => 
          t.type === "journalentry" &&
          t.debitAccount?._id?.toString() === agentAccount._id.toString() &&
          t.creditAccount?.type === "recipient"
      );

      const agentCancellations = todayTransactions.filter(
        (t: any) => 
          t.type === "payment" &&
          t.creditAccount?._id?.toString() === agentAccount._id.toString() &&
          t.note?.toLowerCase().includes("cancelled")
      );

      const received = agentReceipts.reduce((sum: number, r: any) => sum + r.amount, 0);
      const commission = agentCommissions.reduce((sum: number, c: any) => sum + c.amount, 0);
      const paid = agentPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
      const cancelled = agentCancellations.reduce((sum: number, c: any) => sum + c.amount, 0);

      const closing = opening + received - commission - paid + cancelled;

      agentDashboardData.push({
        _id: agent._id.toString(),
        name: agent.name,
        opening,
        received,
        commission,
        paid,
        cancelled,
        closing
      });

      totalOpeningBalance += opening;
      totalReceived += received;
      totalCommission += commission;
      totalPaid += paid;
      totalCancelled += cancelled;
    }

    const totalClosingBalance = totalOpeningBalance + totalReceived - totalCommission - totalPaid + totalCancelled;

    const summary: DashboardSummary = {
      totalOpeningBalance,
      totalReceived,
      totalCommission,
      totalPaid,
      totalCancelled,
      totalClosingBalance
    };

    return res.status(200).json({
      summary,
      agents: agentDashboardData
    });

  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return res.status(500).json({ error: error.message });
  }
}