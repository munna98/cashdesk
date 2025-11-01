import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const receipts = await Transaction.find({ type: "receipt" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("debitAccount", "name")  // Updated: from fromAccount to debitAccount
      .populate("creditAccount", "name"); // Updated: from toAccount to creditAccount

    const formatted = receipts.map((t) => ({
      _id: t._id,
      transactionNumber: t.transactionNumber,
      note: t.note,
      amount: t.amount,
      commission: t.commissionAmount, // Updated: from commission to commissionAmount
      date: t.date,
      // Updated: For receipts, debitAccount is Cash and creditAccount is Agent
      // We want to show the Agent name (creditAccount) in the receipt list
      account: {
        name: t.creditAccount?.name || "Unknown", // Updated: from fromAccount to creditAccount
      },
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
}