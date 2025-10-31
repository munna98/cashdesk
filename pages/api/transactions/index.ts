// pages/api/transactions/index.ts - Updated to handle journal entries
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Counter from "@/models/Counter";
import Account from "@/models/Account";
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
        const { type, date } = req.query;

        const query: any = {};
        if (type) query.type = type;
        if (date) {
          const start = new Date(date as string);
          const end = new Date(date as string);
          end.setDate(end.getDate() + 1);
          query.date = { $gte: start, $lt: end };
        }

        const transactions: ITransaction[] = await Transaction.find(query)
          .populate("fromAccount", "name")
          .populate("toAccount", "name")
          .populate("effectedAccount", "name")
          .sort({ createdAt: -1 });

        return res.status(200).json(transactions);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const { 
          fromAccount, 
          toAccount, 
          amount, 
          date, 
          note, 
          type, 
          commissionAmount, 
          effectedAccount 
        } = req.body;

        if (!fromAccount || !toAccount || !amount || !date || !type) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate type
        if (!["receipt", "payment", "journalentry"].includes(type)) {
          return res.status(400).json({ message: "Invalid transaction type" });
        }

        // Determine counter key and prefix based on type
        let counterKey: string;
        let prefix: string;

        switch (type) {
          case "payment":
            counterKey = "payment";
            prefix = "PMT";
            break;
          case "receipt":
            counterKey = "receipt";
            prefix = "RCT";
            break;
          case "journalentry":
            counterKey = "journalentry";
            prefix = "JNL";
            break;
          default:
            return res.status(400).json({ message: "Invalid transaction type" });
        }

        const seq = await getNextSequence(counterKey);
        const year = new Date().getFullYear();
        const transactionNumber = `${prefix}-${year}-${seq
          .toString()
          .padStart(5, "0")}`;

        // Create the main transaction
        const transaction = await Transaction.create({
          transactionNumber,
          fromAccount,
          toAccount,
          amount,
          date,
          note,
          type,
          commissionAmount: commissionAmount || 0,
          effectedAccount,
        });

        // If it's a receipt with commission, create a commission payment
        if (type === "receipt" && commissionAmount && commissionAmount > 0) {
          const commissionAccount = await Account.findOne({
            name: "Commission",
          });

          if (commissionAccount) {
            const commissionSeq = await getNextSequence("payment");
            const commissionTransactionNumber = `PMT-${year}-${commissionSeq
              .toString()
              .padStart(5, "0")}`;

            await Transaction.create({
              transactionNumber: commissionTransactionNumber,
              fromAccount: toAccount, // cash account
              toAccount: commissionAccount._id,
              amount: commissionAmount,
              date,
              note: `Commission for receipt ${transactionNumber}`,
              type: "payment",
            });
          } else {
            console.warn(
              "Commission account not found. Skipping commission payment."
            );
          }
        }

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
