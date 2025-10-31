// pages/api/transactions/index.ts - Corrected Agent Clearing Journal Entry
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Counter from "@/models/Counter";
import Account from "@/models/Account";

// ... (getNextSequence and generateTransactionNumber functions remain the same) ...

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
          .populate("fromAccount", "name")
          .populate("toAccount", "name")
          .sort({ createdAt: -1 });

        return res.status(200).json(transactions);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const {
          fromAccount, // Expected: Cash/Bank A/c (for Payment) or Agent A/c (for Receipt)
          toAccount,   // Expected: Recipient/Expense A/c (for Payment) or Cash A/c (for Receipt)
          amount,
          date,
          note,
          type,
          commissionAmount,
          effectedAccount // This is expected to be the Agent Account ID for clearing
        } = req.body;

        if (!fromAccount || !toAccount || !amount || !date || !type) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate type
        if (!["receipt", "payment", "journalentry"].includes(type)) {
          return res.status(400).json({ message: "Invalid transaction type" });
        }

        // ========== RECEIPT FLOW (Logic seems correct now) ==========
        if (type === "receipt") {
          // 1. Create Receipt Entry: Dr Cash A/c | Cr Agent A/c
          // fromAccount: Agent A/c (Cr), toAccount: Cash A/c (Dr) -> CORRECT
          const receiptSeq = await getNextSequence("receipt");
          const receiptNumber = generateTransactionNumber("receipt", receiptSeq);

          const receipt = await Transaction.create({
            transactionNumber: receiptNumber,
            fromAccount, 
            toAccount,   
            amount,
            commissionAmount: commissionAmount || 0,
            date,
            note,
            type: "receipt",
          });

          // 2. Create Commission Journal Entry: Dr Agent A/c | Cr Commission Income A/c
          if (commissionAmount && commissionAmount > 0) {
            const commissionAccount = await Account.findOne({
              name: "Commission",
              type: "income"
            });

            if (!commissionAccount) {
              await Transaction.findByIdAndDelete(receipt._id);
              return res.status(400).json({
                error: "Commission account not found. Please create an income account named 'Commission'."
              });
            }

            const journalSeq = await getNextSequence("journalentry");
            const journalNumber = generateTransactionNumber("journalentry", journalSeq);

            // fromAccount: Commission A/c (Cr), toAccount: Agent A/c (Dr) -> CORRECT
            const commissionJournal = await Transaction.create({
              transactionNumber: journalNumber,
              fromAccount: commissionAccount._id, // Commission Income A/c (Credit) 
              toAccount: fromAccount,      // Agent account (Debit)     
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

        // ========== PAYMENT FLOW (CORRECTED Journal Entry) ==========
        if (type === "payment") {
          // Check if this is a payment to a recipient (requires agent clearing)
          const toAccountDoc = await Account.findById(toAccount);

          if (!toAccountDoc) {
            return res.status(400).json({ error: "To account not found" });
          }

          // 1. Create Payment Entry: Dr Recipient A/c | Cr Cash A/c
          // fromAccount: Cash A/c (Cr), toAccount: Recipient A/c (Dr) -> CORRECT
          const paymentSeq = await getNextSequence("payment");
          const paymentNumber = generateTransactionNumber("payment", paymentSeq);

          const payment = await Transaction.create({
            transactionNumber: paymentNumber,
            fromAccount,  // Cash account (Credit)
            toAccount,    // Recipient/Expense account (Debit)
            amount,
            date,
            note,
            type: "payment",
          });

          // 2. Create Agent Clearing Journal (if payment to recipient and agent specified)
          if (toAccountDoc.type === "recipient" && effectedAccount) {
            const journalSeq = await getNextSequence("journalentry");
            const journalNumber = generateTransactionNumber("journalentry", journalSeq);

            // Target Accounting: Dr Agent A/c | Cr Recipient A/c
            // Database Mapping: fromAccount (Cr) | toAccount (Dr)
            const clearingJournal = await Transaction.create({
              transactionNumber: journalNumber,
              fromAccount: toAccount,              // Recipient account (CREDIT)
              toAccount: effectedAccount,  // Agent account (DEBIT)
              amount,
              date,
              note: `Agent clearing for payment ${paymentNumber}`,
              type: "journalentry",
              relatedTransactionId: payment._id,
            });

            // Update payment with related journal ID
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

        // ========== JOURNAL ENTRY FLOW (Logic remains the same) ==========
        if (type === "journalentry") {
          const seq = await getNextSequence("journalentry");
          const transactionNumber = generateTransactionNumber("journalentry", seq);

          const journal = await Transaction.create({
            transactionNumber,
            fromAccount,
            toAccount,
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