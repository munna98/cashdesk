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
      .populate("fromAccount", "name")
      .populate("toAccount", "name");

    const formatted = journals.map((t) => ({
      _id: t._id,
      transactionNumber: t.transactionNumber,
      note: t.note,
      amount: t.amount,
      date: t.date,
      fromAccount: {
        name: t.fromAccount?.name || "Unknown",
      },
      toAccount: {
        name: t.toAccount?.name || "Unknown",
      },
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error("Error fetching journal entries:", err);
    res.status(500).json({ error: "Failed to fetch journal entries" });
  }
}