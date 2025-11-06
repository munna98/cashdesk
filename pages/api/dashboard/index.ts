// pages/api/dashboard/index.ts - Updated to exclude opening balance journals

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

    // 1. Get all transactions BEFORE the target date (for opening balance)
    // ⭐ FIX: Exclude opening balance journals from the historical transactions
    const allTransactions = await Transaction.find({
      date: { $lt: startOfDay },
      note: { $not: { $regex: /^Opening balance for/i } }, // <-- ADDED EXCLUSION HERE
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

      // 2. Calculate opening balance: stored opening + transactions before target date
      let opening = agentAccount.openingBalance || 0;
      
      // Consistency with Ledger logic: If the account is Credit-Normal, ensure the opening balance starts as negative
      const isAgentCreditNormal = agentAccount.type === 'agent';
      if (isAgentCreditNormal) {
        opening = -Math.abs(opening);
      } else {
        opening = Math.abs(opening);
      }

      // Apply historical transactions (Credit adds to liability magnitude, Debit subtracts)
      allTransactions.forEach((txn: any) => {
        const isDebited = txn.debitAccount?.toString() === agentAccount._id.toString();
        const isCredited = txn.creditAccount?.toString() === agentAccount._id.toString();
        
        if (isDebited) {
          opening += txn.amount;  // Debit (Commission) adds to the negative balance (e.g., -7000 + 3 = -6997)
        } else if (isCredited) {
          opening -= txn.amount;  // Credit (Receipt) subtracts from the negative balance (e.g., -5000 - 2000 = -7000)
        }
      });
      // The 'opening' variable now holds the correctly signed internal balance up to the start of the day.

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
          t.creditAccount?.type === "recipient" // Assuming payments are debits to Agent and credits to Recipient
      );

      const agentCancellations = todayTransactions.filter(
        (t: any) => 
          t.type === "payment" && // Assuming cancellation is recorded as a Payment transaction type
          t.creditAccount?._id?.toString() === agentAccount._id.toString() &&
          t.note?.toLowerCase().includes("cancelled")
      );

      const received = agentReceipts.reduce((sum: number, r: any) => sum + r.amount, 0);
      const commission = agentCommissions.reduce((sum: number, c: any) => sum + c.amount, 0);
      const paid = agentPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
      const cancelled = agentCancellations.reduce((sum: number, c: any) => sum + c.amount, 0);

      // 3. Today's calculation needs to be done using absolute values for presentation purposes
      // The calculation here is based on the logic we established: Credit adds to magnitude, Debit subtracts from magnitude.
      // This part of the code calculates the CLOSING balance based on the magnitude of the amounts, 
      // not the signed internal balance, which is prone to error if mixed. 
      // Let's ensure the closing is correct by running the transactions against the signed opening balance.
      
      let closingSigned = opening;
      // Received (Credit) -> Subtract from negative balance
      closingSigned -= received; 
      // Commission (Debit) -> Add to negative balance
      closingSigned += commission; 
      // Paid (Debit) -> Add to negative balance (assuming payment is a deduction from agent's credit)
      closingSigned += paid;
      // Cancelled (Credit) -> Subtract from negative balance (assuming cancellation increases the liability)
      closingSigned -= cancelled;
      
      const closingAbsolute = Math.abs(closingSigned);
      const openingAbsolute = Math.abs(opening);


      agentDashboardData.push({
        _id: agent._id.toString(),
        name: agent.name,
        opening: openingAbsolute, // Use absolute value for display
        received,
        commission,
        paid,
        cancelled,
        closing: closingAbsolute // Use absolute value for display
      });

      totalOpeningBalance += openingAbsolute;
      totalReceived += received;
      totalCommission += commission;
      totalPaid += paid;
      totalCancelled += cancelled;
    }

    // Final total calculation must use the summed absolute values
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