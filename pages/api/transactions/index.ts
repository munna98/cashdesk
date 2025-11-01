// pages/api/transactions/index.ts - Updated with debit/credit terminology
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Counter from "@/models/Counter";
import Account from "@/models/Account";

async function getNextSequence(name: string) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

function generateTransactionNumber(type: string, seq: number) {
  const year = new Date().getFullYear();
  let prefix = "TXN";

  switch (type) {
    case "payment":
      prefix = "PMT";
      break;
    case "receipt":
      prefix = "RCT";
      break;
    case "journalentry":
      prefix = "JNL";
      break;
  }

  return `${prefix}-${year}-${seq.toString().padStart(5, "0")}`;
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

        const transactions = await Transaction.find(query)
          .populate("debitAccount", "name")
          .populate("creditAccount", "name")
          .sort({ createdAt: -1 });

        return res.status(200).json(transactions);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const {
          debitAccount,
          creditAccount,
          amount,
          date,
          note,
          type,
          commissionAmount,
          effectedAccount, // Optional: for payment to recipient
        } = req.body;

        if (!debitAccount || !creditAccount || !amount || !date || !type) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        if (!["receipt", "payment", "journalentry"].includes(type)) {
          return res.status(400).json({ message: "Invalid transaction type" });
        }

        // ========== RECEIPT FLOW ==========
        // Dr Cash | Cr Agent
        if (type === "receipt") {
          const receiptSeq = await getNextSequence("receipt");
          const receiptNumber = generateTransactionNumber("receipt", receiptSeq);

          const receipt = await Transaction.create({
            transactionNumber: receiptNumber,
            debitAccount,    // Cash Account
            creditAccount,   // Agent Account
            amount,
            commissionAmount: commissionAmount || 0,
            date,
            note,
            type: "receipt",
          });

          // Create Commission Journal Entry: Dr Agent | Cr Commission Income
          if (commissionAmount && commissionAmount > 0) {
            const commissionAccount = await Account.findOne({
              name: "Commission",
              type: "income"
            });

            if (!commissionAccount) {
              await Transaction.findByIdAndDelete(receipt._id);
              return res.status(400).json({
                error: "Commission account not found."
              });
            }

            const journalSeq = await getNextSequence("journalentry");
            const journalNumber = generateTransactionNumber("journalentry", journalSeq);

            const commissionJournal = await Transaction.create({
              transactionNumber: journalNumber,
              debitAccount: creditAccount,           // Agent Account (Dr)
              creditAccount: commissionAccount._id,  // Commission Income (Cr)
              amount: commissionAmount,
              date,
              note: `Commission for receipt ${receiptNumber}`,
              type: "journalentry",
              relatedTransactionId: receipt._id,
            });

            await Transaction.findByIdAndUpdate(receipt._id, {
              relatedTransactionId: commissionJournal._id
            });

            return res.status(201).json({
              ...receipt.toObject(),
              relatedJournal: commissionJournal
            });
          }

          return res.status(201).json(receipt);
        }

        // ========== PAYMENT FLOW ==========
        // Dr Expense/Recipient | Cr Cash
        if (type === "payment") {
          const debitAccountDoc = await Account.findById(debitAccount);

          if (!debitAccountDoc) {
            return res.status(400).json({ error: "Debit account not found" });
          }

          const paymentSeq = await getNextSequence("payment");
          const paymentNumber = generateTransactionNumber("payment", paymentSeq);

          const payment = await Transaction.create({
            transactionNumber: paymentNumber,
            debitAccount,    // Expense/Recipient Account (Dr)
            creditAccount,   // Cash Account (Cr)
            amount,
            date,
            note,
            type: "payment",
          });

          // Create Agent Clearing Journal if payment to recipient
          // Dr Agent | Cr Recipient
          if (debitAccountDoc.type === "recipient" && effectedAccount) {
            const journalSeq = await getNextSequence("journalentry");
            const journalNumber = generateTransactionNumber("journalentry", journalSeq);

            const clearingJournal = await Transaction.create({
              transactionNumber: journalNumber,
              debitAccount: effectedAccount,  // Agent Account (Dr)
              creditAccount: debitAccount,    // Recipient Account (Cr)
              amount,
              date,
              note: `Agent clearing for payment ${paymentNumber}`,
              type: "journalentry",
              relatedTransactionId: payment._id,
            });

            await Transaction.findByIdAndUpdate(payment._id, {
              relatedTransactionId: clearingJournal._id
            });

            return res.status(201).json({
              ...payment.toObject(),
              relatedJournal: clearingJournal
            });
          }

          return res.status(201).json(payment);
        }

        // ========== JOURNAL ENTRY FLOW ==========
        if (type === "journalentry") {
          const seq = await getNextSequence("journalentry");
          const transactionNumber = generateTransactionNumber("journalentry", seq);

          const journal = await Transaction.create({
            transactionNumber,
            debitAccount,
            creditAccount,
            amount,
            date,
            note,
            type: "journalentry",
          });

          return res.status(201).json(journal);
        }

        return res.status(400).json({ message: "Invalid transaction type" });

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