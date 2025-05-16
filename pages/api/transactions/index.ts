import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Counter from "@/models/Counter";
import Account from "@/models/Account"; // import the Account model
import Agent from "@/models/Agent";   // Import the Agent model
import { ITransaction } from "@/types/transaction";

async function getNextSequence(name: string) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const transactions: ITransaction[] = await Transaction.find()
          .populate("fromAccount", "name")
          .populate("toAccount", "name");

        return res.status(200).json(transactions);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const { fromAccount, toAccount, amount, date, note, type } = req.body;

        if (!fromAccount || !toAccount || !amount || !date || !type) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        let commissionAmount = 0;
        if (type === "receipt") {
          const agentAccount = await Account.findById(fromAccount).populate('linkedEntityId');
          if (agentAccount && agentAccount.linkedEntityType === 'Agent' && agentAccount.linkedEntityId && (agentAccount.linkedEntityId as any).commPercent) {
            commissionAmount = (amount * (agentAccount.linkedEntityId as any).commPercent) / 100;
          }
        }

        const counterKey = type === "payment" ? "payment" : "receipt";
        const seq = await getNextSequence(counterKey);
        const year = new Date().getFullYear();
        const prefix = type === "payment" ? "PMT" : "RCT";
        const transactionNumber = `${prefix}-${year}-${seq.toString().padStart(5, "0")}`;

        const transaction = await Transaction.create({
          transactionNumber,
          fromAccount,
          toAccount,
          amount,
          commission: commissionAmount, 
          date,
          note,
          type,
        });

        return res.status(201).json(transaction);
      } catch (error: any) {
        console.error("Transaction POST error:", error);
        return res.status(500).json({ error: error.message });
      }
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
  }
}