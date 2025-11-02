// pages/api/reports/transaction-register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { startDate, endDate, type } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    const start = new Date(startDate as string);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);

    const query: any = {
      date: { $gte: start, $lte: end },
    };

    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .populate("debitAccount", "name type")
      .populate("creditAccount", "name type")
      .sort({ date: 1, createdAt: 1 });

    res.status(200).json({ transactions });
  } catch (error: any) {
    console.error("Error generating transaction register:", error);
    res.status(500).json({ error: error.message });
  }
}
