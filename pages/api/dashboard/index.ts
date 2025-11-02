// pages/api/dashboard/index.ts - Updated with cancellation tracking
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
  cancelled: number; // NEW
  closing: number;
}

interface DashboardSummary {
  totalOpeningBalance: number;
  totalReceived: number;
  totalCommission: number;
  totalPaid: number;
  totalCancelled: number; // NEW
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
    
    // Set time boundaries for the target date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all agents
    const agents = await Agent.find({});
    
    // Get all accounts
    const accounts = await Account.find({});

    // Get all transactions (for opening balance calculation)
    const allTransactions = await Transaction.find({
      date: { $lt: startOfDay }
    }).select('debitAccount creditAccount amount type note');

    // Get today's transactions
    const todayTransactions = await Transaction.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('debitAccount', 'name type')
    .populate('creditAccount', 'name type');

    // Initialize agent data array
    const agentDashboardData: AgentDashboardData[] = [];
    
    let totalOpeningBalance = 0;
    let totalReceived = 0;
    let totalCommission = 0;
    let totalPaid = 0;
    let totalCancelled = 0; // NEW

    // Process each agent
    for (const agent of agents) {
      // Find agent's account
      const agentAccount = accounts.find(
        (acc: any) => 
          acc.type === "agent" && 
          acc.linkedEntityId?.toString() === agent._id.toString()
      );

      if (!agentAccount) continue;

      // Calculate opening balance (before today)
      let opening = agentAccount.openingBalance || 0;
      
      allTransactions.forEach((txn: any) => {
        const isDebited = txn.debitAccount?.toString() === agentAccount._id.toString();
        const isCredited = txn.creditAccount?.toString() === agentAccount._id.toString();

        if (isDebited) {
          opening -= txn.amount;  // Debit reduces agent balance (they owe less)
        } else if (isCredited) {
          opening += txn.amount;  // Credit increases agent balance (they owe more)
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

      // NEW: Filter cancellations (payments with "Cancelled" in note to agent)
      const agentCancellations = todayTransactions.filter(
        (t: any) => 
          t.type === "payment" &&
          t.creditAccount?._id?.toString() === agentAccount._id.toString() &&
          t.note?.toLowerCase().includes("cancelled")
      );

      const received = agentReceipts.reduce((sum: number, r: any) => sum + r.amount, 0);
      const commission = agentCommissions.reduce((sum: number, c: any) => sum + c.amount, 0);
      const paid = agentPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
      const cancelled = agentCancellations.reduce((sum: number, c: any) => sum + c.amount, 0); // NEW

      const closing = opening + received - commission - paid + cancelled;

      agentDashboardData.push({
        _id: agent._id.toString(),
        name: agent.name,
        opening,
        received,
        commission,
        paid,
        cancelled, // NEW
        closing
      });

      // Add to totals
      totalOpeningBalance += opening;
      totalReceived += received;
      totalCommission += commission;
      totalPaid += paid;
      totalCancelled += cancelled; // NEW
    }

    // Calculate total closing balance
    const totalClosingBalance = totalOpeningBalance + totalReceived - totalCommission - totalPaid + totalCancelled;

    const summary: DashboardSummary = {
      totalOpeningBalance,
      totalReceived,
      totalCommission,
      totalPaid,
      totalCancelled, // NEW
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