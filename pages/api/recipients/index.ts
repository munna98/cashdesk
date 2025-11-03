// pages/api/recipients/index.ts - Updated with Opening Balance Journal
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Recipient from "@/models/Recipient";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";
import Counter from "@/models/Counter";

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
  let prefix = "JNL";
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
        const recipients = await Recipient.find({});
        return res.status(200).json(recipients);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }

    case "POST":
      try {
        const { openingBalance = 0, ...recipientData } = req.body;
        
        // Create the recipient first
        const recipient = await Recipient.create(recipientData);

        // Create the associated account WITH opening balance stored for reference
        const account = await Account.create({
          name: req.body.name,
          type: "recipient",
          linkedEntityType: "recipient",
          linkedEntityId: recipient._id,
          openingBalance: openingBalance, // ✅ Store for display purposes
          balance: 0, // Will be calculated from transactions
        });

        // ✅ NEW: If opening balance exists, create journal entry
        if (openingBalance && openingBalance !== 0) {
          const openingBalanceAccount = await Account.findOne({
            name: "Opening Balance",
            type: "equity"
          });

          if (!openingBalanceAccount) {
            await Recipient.findByIdAndDelete(recipient._id);
            await Account.findByIdAndDelete(account._id);
            return res.status(400).json({
              error: "Opening Balance account not found. Please contact support."
            });
          }

          const journalSeq = await getNextSequence("journalentry");
          const journalNumber = generateTransactionNumber("journalentry", journalSeq);

          // Create Journal Entry: Dr Recipient | Cr Opening Balance
          // (Since recipient balance is debit normal - we owe them)
          await Transaction.create({
            transactionNumber: journalNumber,
            debitAccount: account._id,                // Recipient Account (Dr)
            creditAccount: openingBalanceAccount._id, // Opening Balance (Cr)
            amount: Math.abs(openingBalance),
            date: new Date(),
            note: `Opening balance for ${req.body.name}`,
            type: "journalentry",
          });
        }

        return res.status(201).json({
          recipient,
          account,
        });
      } catch (err: any) {
        if (req.body._id) {
          try {
            await Recipient.findByIdAndDelete(req.body._id);
          } catch (cleanupErr) {
            console.error("Failed to clean up recipient after error:", cleanupErr);
          }
        }
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}