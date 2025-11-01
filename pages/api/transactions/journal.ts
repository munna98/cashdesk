// pages/api/transactions/journal.ts - Get journal entries only
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const journals = await Transaction.find({ type: "journalentry" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("debitAccount", "name")  // Updated: from fromAccount to debitAccount
      .populate("creditAccount", "name"); // Updated: from toAccount to creditAccount

    const formatted = journals.map((t) => ({
      _id: t._id,
      transactionNumber: t.transactionNumber,
      note: t.note,
      amount: t.amount,
      date: t.date,
      // Updated: For journal entries, debitAccount is the account being debited
      // and creditAccount is the account being credited
      debitAccount: {
        name: t.debitAccount?.name || "Unknown", // Updated: from fromAccount to debitAccount
      },
      creditAccount: {
        name: t.creditAccount?.name || "Unknown", // Updated: from toAccount to creditAccount
      },
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error("Error fetching journal entries:", err);
    res.status(500).json({ error: "Failed to fetch journal entries" });
  }
}