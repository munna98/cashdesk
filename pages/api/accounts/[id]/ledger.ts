// pages/api/accounts/[id]/ledger.ts - FINAL, VERIFIED VERSION

import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, startDate, endDate } = req.query;

    await dbConnect();

    try {
        // 1️⃣ Get the account
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }

        // 2️⃣ Set up date filters
        const dateFilter: any = {};
        if (startDate) dateFilter.$gte = new Date(startDate as string);
        if (endDate) dateFilter.$lte = new Date(endDate as string);

        // 3️⃣ Build query - EXCLUDE opening balance journals
        const transactionsQuery: any = {
            $or: [{ debitAccount: id }, { creditAccount: id }],
            note: { $not: { $regex: /^Opening balance for/i } },
        };
        
        if (Object.keys(dateFilter).length > 0) {
            transactionsQuery.date = dateFilter;
        }

        const transactions = await Transaction.find(transactionsQuery)
            .sort({ date: 1, createdAt: 1 })
            .populate("debitAccount", "name type")
            .populate("creditAccount", "name type");

        // 4️⃣ Determine account nature
        const debitNormalTypes = ["asset", "expense", "cash", "recipient"];
        let isDebitNormal = debitNormalTypes.includes(account.type);
        
        // Ensure 'agent' accounts are always treated as Credit-Normal (Liability)
        if (account.type === 'agent') {
            isDebitNormal = false; 
        }
        
        // 5️⃣ Calculate opening balance (EXCLUDING opening journal)
        let openingBalance = account.openingBalance || 0;

        // Force correct sign for internal running balance: Credit-Normal MUST be negative internally
        if (!isDebitNormal) {
            openingBalance = -Math.abs(openingBalance);
        } else {
            openingBalance = Math.abs(openingBalance);
        }

        // If date filter is applied, calculate opening from prior transactions
        if (startDate) {
            const priorTxns = await Transaction.find({
                $or: [{ debitAccount: id }, { creditAccount: id }],
                date: { $lt: new Date(startDate as string) },
                note: { $not: { $regex: /^Opening balance for/i } }, 
            });

            // Logic for prior transactions: Credit adds to magnitude, Debit subtracts
            openingBalance = priorTxns.reduce((balance, txn) => {
                const isDebited = txn.debitAccount.toString() === id;
                const amount = txn.amount;

                if (isDebited) {
                    return balance + amount; // Debit (Commission) adds to the negative balance (e.g., -7000 + 3 = -6997)
                } else {
                    return balance - amount; // Credit (Receipt) subtracts from the negative balance (e.g., -5000 - 2000 = -7000)
                }
            }, openingBalance);
        }
        
        // 6️⃣ Process transactions with running balance 🚀 FINAL LOGIC 🚀
        let runningBalance = openingBalance;
        const ledgerEntries = transactions.map((txn) => {
            const isDebited = txn.debitAccount._id.toString() === id;
            const amount = txn.amount;

            // --- 👇 LOGIC FOR ₹6,997 Cr RESULT 👇 ---
            
            if (isDebited) {
                // DEBIT (Commission) MUST DECREASE the magnitude of the credit balance (i.e., add to the negative internal balance)
                runningBalance += amount;
            } else {
                // CREDIT (Receipt) MUST INCREASE the magnitude of the credit balance (i.e., subtract from the negative internal balance)
                runningBalance -= amount;
            }
            
            // --- 👆 END OF FINAL CORRECTED LOGIC 👆 ---

            // Determine which column the amount appears in
            const entryDebit = isDebited ? amount : 0;
            const entryCredit = !isDebited ? amount : 0;

            // Get counterparty
            const counterparty = isDebited 
                ? txn.creditAccount.name 
                : txn.debitAccount.name;

            return {
                _id: txn._id,
                date: txn.date,
                transactionNumber: txn.transactionNumber,
                note: txn.note,
                type: txn.type,
                debitAccount: txn.debitAccount,
                creditAccount: txn.creditAccount,
                counterparty,
                debit: entryDebit,
                credit: entryCredit,
                balance: runningBalance,
            };
        });

        // 7️⃣ Prepare response
        const response = {
            accountName: account.name,
            accountType: account.type,
            isDebitNormal,
            period: {
                startDate: startDate || "All time",
                endDate: endDate || "Present",
            },
            openingBalance,
            entries: ledgerEntries,
            closingBalance: runningBalance,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Failed to fetch ledger:", error);
        res.status(500).json({ error: "Failed to fetch ledger" });
    }
}