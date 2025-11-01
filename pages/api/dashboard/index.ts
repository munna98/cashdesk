// pages/api/dashboard/index.ts
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
  closing: number;
}

interface DashboardSummary {
  cashOpeningBalance: number;
  totalReceived: number;
  totalCommission: number;
  totalPaid: number;
  cashClosingBalance: number;
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
    
    // Find cash account
    const cashAccount = accounts.find((acc: any) => acc.type === "cash");
    
    if (!cashAccount) {
      return res.status(400).json({ error: "Cash account not found" });
    }

    // Get all transactions (for opening balance calculation)
    const allTransactions = await Transaction.find({
      date: { $lt: startOfDay }
    }).select('debitAccount creditAccount amount type');

    // Get today's transactions
    const todayTransactions = await Transaction.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('debitAccount', 'name type')
    .populate('creditAccount', 'name type');

    // Calculate cash opening balance
    let cashOpeningBalance = cashAccount.openingBalance || 0;
    
    allTransactions.forEach((txn: any) => {
      const isDebited = txn.debitAccount?.toString() === cashAccount._id.toString();
      const isCredited = txn.creditAccount?.toString() === cashAccount._id.toString();

      if (isDebited) {
        cashOpeningBalance += txn.amount;
      } else if (isCredited) {
        cashOpeningBalance -= txn.amount;
      }
    });

    // Initialize agent data array
    const agentDashboardData: AgentDashboardData[] = [];
    
    let totalReceived = 0;
    let totalCommission = 0;
    let totalPaid = 0;

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
          opening += txn.amount;
        } else if (isCredited) {
          opening -= txn.amount;
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

      const received = agentReceipts.reduce((sum: number, r: any) => sum + r.amount, 0);
      const commission = agentCommissions.reduce((sum: number, c: any) => sum + c.amount, 0);
      const paid = agentPayments.reduce((sum: number, p: any) => sum + p.amount, 0);

      const closing = opening + received - commission - paid;

      agentDashboardData.push({
        _id: agent._id.toString(),
        name: agent.name,
        opening,
        received,
        commission,
        paid,
        closing
      });

      // Add to totals
      totalReceived += received;
      totalCommission += commission;
      totalPaid += paid;
    }

    // Calculate cash closing balance
    const cashClosingBalance = cashOpeningBalance + totalReceived - totalPaid;

    const summary: DashboardSummary = {
      cashOpeningBalance,
      totalReceived,
      totalCommission,
      totalPaid,
      cashClosingBalance
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