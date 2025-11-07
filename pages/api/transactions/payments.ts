// /pages/api/transactions/payments.ts

import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const payments = await Transaction.find({ type: "payment" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("debitAccount", "name")  // Updated: from fromAccount to debitAccount
      .populate("creditAccount", "name"); // Updated: from toAccount to creditAccount

    const formatted = payments.map((t) => ({
      _id: t._id,
      transactionNumber: t.transactionNumber,
      note: t.note,
      amount: t.amount,
      date: t.date,
      // Updated: For payments, debitAccount is Recipient and creditAccount is Cash
      // We want to show the Recipient name (debitAccount) in the payment list
      account: {
        name: t.debitAccount?.name || "Unknown", // Updated: from toAccount to debitAccount
      },
    })); 

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
}