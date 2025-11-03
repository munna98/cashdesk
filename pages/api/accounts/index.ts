// pages/api/accounts/index.ts - Updated with Opening Balance Journal
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
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
        const { type, linkedEntityType, linkedEntityId } = req.query;
        const filter: any = {};

        if (type) filter.type = type;
        if (linkedEntityType) filter.linkedEntityType = linkedEntityType;
        if (linkedEntityId) filter.linkedEntityId = linkedEntityId;

        const accounts = await Account.find(filter);
        return res.status(200).json(accounts);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }

    case "POST":
      try {
        const { balance: openingBalance = 0, ...accountData } = req.body;
        
        // Validate required fields
        if (!accountData.name || !accountData.type) {
          return res.status(400).json({
            error: "Missing required fields: name and type are required",
          });
        }

        // Validate type is one of the allowed values
        const allowedTypes = [
          "agent",
          "recipient",
          "cash",
          "income",
          "employee",
          "expense",
          "equity"
        ];
        if (!allowedTypes.includes(accountData.type)) {
          return res.status(400).json({
            error: `Invalid account type. Must be one of: ${allowedTypes.join(", ")}`,
          });
        }

        // Create the account WITH opening balance stored for reference
        const account = await Account.create({
          ...accountData,
          openingBalance: openingBalance, // ✅ Store for display purposes
          balance: 0 // Will be calculated from transactions
        });

        // ✅ NEW: If opening balance exists, create journal entry
        if (openingBalance && openingBalance !== 0) {
          const openingBalanceAccount = await Account.findOne({
            name: "Opening Balance",
            type: "equity"
          });

          if (!openingBalanceAccount) {
            await Account.findByIdAndDelete(account._id);
            return res.status(400).json({
              error: "Opening Balance account not found. Please contact support."
            });
          }

          const journalSeq = await getNextSequence("journalentry");
          const journalNumber = generateTransactionNumber("journalentry", journalSeq);

          // Determine debit/credit based on account type
          // Credit normal types: liability, income, agent
          // Debit normal types: asset, expense, cash, recipient, employee
          const creditNormalTypes = ['liability', 'income', 'agent'];
          const isCreditNormal = creditNormalTypes.includes(accountData.type);

          let debitAccount, creditAccount;
          
          if (isCreditNormal) {
            // Dr Opening Balance | Cr Account
            debitAccount = openingBalanceAccount._id;
            creditAccount = account._id;
          } else {
            // Dr Account | Cr Opening Balance
            debitAccount = account._id;
            creditAccount = openingBalanceAccount._id;
          }

          await Transaction.create({
            transactionNumber: journalNumber,
            debitAccount,
            creditAccount,
            amount: Math.abs(openingBalance),
            date: new Date(),
            note: `Opening balance for ${accountData.name}`,
            type: "journalentry",
          });
        }

        return res.status(201).json(account);
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}