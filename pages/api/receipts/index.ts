import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Receipt from "@/models/Receipt";
import { IReceipt } from "@/types/receipt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const receipts: IReceipt[] = await Receipt.find().populate("agentId", "name");
        return res.status(200).json(receipts);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const { agentId, amount, date, note } = req.body;

        if (!agentId || !amount || !date) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const newReceipt: IReceipt = await Receipt.create({
          agentId,
          amount,
          date,
          note,
        });

        return res.status(201).json(newReceipt);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
