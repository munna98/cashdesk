import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  await dbConnect();

  try {
    const transactions = await Transaction.find({
      $or: [{ fromAccount: id }, { toAccount: id }],
    }).sort({ date: 1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Failed to fetch ledger:", error);
    res.status(500).json({ error: "Failed to fetch ledger" });
  }
}
