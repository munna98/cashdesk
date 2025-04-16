
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const receipts = await Transaction.find({ type: "receipt" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("fromAccount", "name")
      .populate("toAccount", "name");

      const formatted = receipts.map((t) => ({
        _id: t._id,
        transactionNumber: t.transactionNumber,
        note: t.note,
        amount: t.amount,
        date: t.date,
        account: {
          name: t.fromAccount?.name || "Unknown",
        },
      }));

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
}
