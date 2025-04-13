// /pages/api/transactions/recent-receipts.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const receipts = await Transaction.find({ type: "receipt" })
      .sort({ date: -1 })
      .limit(5)
      .populate("accountId", "name"); // Only populate name field

    const formatted = receipts.map((t) => ({
      _id: t._id,
      amount: t.amount,
      date: t.date,
      account: {
        name: t.accountId?.name || "Unknown",
      },
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
}
