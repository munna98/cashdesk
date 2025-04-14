 // /api/transactions/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { ITransaction } from "@/types/transaction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  try {
    const transaction = await Transaction.findById(id).populate("accountId", "name");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    switch (method) {
      case "GET":
        return res.status(200).json(transaction);

      case "PUT": {
        const { accountId, amount, date, note, type } = req.body;

        if (!["receipt", "payment"].includes(transaction.type)) {
          return res.status(400).json({ message: "Invalid transaction type" });
        }

        // Optionally validate `type` in request body if you want to enforce it
        // if (type && type !== transaction.type) {
        //   return res.status(400).json({ message: "Cannot change transaction type" });
        // }

        transaction.accountId = accountId;
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
    return res.status(500).json({ error: error.message });
  }
}
