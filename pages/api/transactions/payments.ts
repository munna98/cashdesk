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
      .populate("accountId", "name");

    const formatted = payments.map((t) => ({
      _id: t._id,
      transactionNumber: t.transactionNumber,
      note: t.note,
      amount: t.amount,
      date: t.date,
      account: {
        name: t.accountId?.name || "Unknown",
      },
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
}
