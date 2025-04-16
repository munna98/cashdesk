// /api/transactions/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  try {
    const transaction = await Transaction.findById(id)
      .populate("fromAccount", "name")
      .populate("toAccount", "name");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    switch (method) {
      case "GET":
        return res.status(200).json(transaction);

      case "PUT": {
        const { fromAccount, toAccount, amount, date, note } = req.body;

        if (!["receipt", "payment"].includes(transaction.type)) {
          return res.status(400).json({ message: "Invalid transaction type" });
        }

        transaction.fromAccount = fromAccount;
        transaction.toAccount = toAccount;
        transaction.amount = amount;
        transaction.date = date;
        transaction.note = note;

        const updated = await transaction.save();
        return res.status(200).json(updated);
      }

      case "DELETE":
        await transaction.deleteOne();
        return res
          .status(200)
          .json({ message: `${transaction.type} deleted successfully` });

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error: any) {
    console.error("Transaction API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
