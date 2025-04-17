import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { startDate, endDate } = req.query;

  await dbConnect();

  try {
    // Get the account
    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Set up date filters
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate as string);
    if (endDate) dateFilter.$lte = new Date(endDate as string);

    // Find transactions
    const transactionsQuery = {
      $or: [{ fromAccount: id }, { toAccount: id }],
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
    };

    const transactions = await Transaction.find(transactionsQuery)
      .sort({ date: 1, createdAt: 1 })
      .populate('fromAccount', 'name type')
      .populate('toAccount', 'name type');

    // Calculate opening balance
    let openingBalance = 0;
    
    if (startDate) {
      const priorTransactions = await Transaction.find({
        $or: [{ fromAccount: id }, { toAccount: id }],
        date: { $lt: new Date(startDate as string) }
      });
      
      openingBalance = priorTransactions.reduce((balance, txn) => {
        if (txn.fromAccount.toString() === id) {
          return balance - txn.amount; // Money went out
        } else {
          return balance + txn.amount; // Money came in
        }
      }, 0);
    }
    
    // Process transactions with running balance
    let runningBalance = openingBalance;
    const ledgerEntries = transactions.map(txn => {
      const isDebit = txn.fromAccount._id.toString() === id;
      const amount = txn.amount;
      
      // Update running balance
      if (isDebit) {
        runningBalance -= amount;
      } else {
        runningBalance += amount;
      }
      
      return {
        _id: txn._id,
        date: txn.date,
        transactionNumber: txn.transactionNumber,
        note: txn.note,
        type: txn.type,
        fromAccount: txn.fromAccount,
        toAccount: txn.toAccount,
        amount: txn.amount,
        counterparty: isDebit ? txn.toAccount.name : txn.fromAccount.name,
        debit: isDebit ? amount : 0,
        credit: !isDebit ? amount : 0,
        balance: runningBalance
      };
    });
    
    // Prepare response
    const response = {
      accountName: account.name,
      accountType: account.type,
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present'
      },
      openingBalance,
      entries: ledgerEntries,
      closingBalance: runningBalance
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Failed to fetch ledger:", error);
    res.status(500).json({ error: "Failed to fetch ledger" });
  }
}