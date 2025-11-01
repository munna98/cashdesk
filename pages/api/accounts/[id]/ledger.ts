// pages/api/accounts/[id]/ledger.ts - Updated with debit/credit terminology
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

        // 3️⃣ Build query - account appears in either debit or credit side
        const transactionsQuery = {
            $or: [{ debitAccount: id }, { creditAccount: id }],
            ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        };

        const transactions = await Transaction.find(transactionsQuery)
            .sort({ date: 1, createdAt: 1 })
            .populate("debitAccount", "name type")
            .populate("creditAccount", "name type");

        // 4️⃣ Determine account nature (Asset/Expense = Debit normal, Liability/Income = Credit normal)
        const debitNormalTypes = ["asset", "expense", "cash", "agent"];
        const isDebitNormal = debitNormalTypes.includes(account.type);
        
        // 5️⃣ Calculate opening balance
        let openingBalance = account.openingBalance || 0;

        // Apply correct sign based on account nature
        if (!isDebitNormal) {
            openingBalance = -openingBalance; // Liability/Income show as negative initially
        }

        if (startDate) {
            const priorTxns = await Transaction.find({
                $or: [{ debitAccount: id }, { creditAccount: id }],
                date: { $lt: new Date(startDate as string) },
            });

            openingBalance = priorTxns.reduce((balance, txn) => {
                const isDebited = txn.debitAccount.toString() === id;
                const amount = txn.amount;

                // Debit increases asset/expense, decreases liability/income
                // Credit decreases asset/expense, increases liability/income
                if (isDebited) {
                    return balance + (isDebitNormal ? amount : -amount);
                } else {
                    return balance + (isDebitNormal ? -amount : amount);
                }
            }, openingBalance);
        }
        
        // 6️⃣ Process transactions with running balance
        let runningBalance = openingBalance;
        const ledgerEntries = transactions.map((txn) => {
            const isDebited = txn.debitAccount._id.toString() === id;
            const amount = txn.amount;

            // Calculate balance change
            let balanceChange: number;
            if (isDebited) {
                // Account is debited
                balanceChange = isDebitNormal ? amount : -amount;
            } else {
                // Account is credited
                balanceChange = isDebitNormal ? -amount : amount;
            }
            
            runningBalance += balanceChange;

            // Determine which column the amount appears in
            const entryDebit = isDebited ? amount : 0;
            const entryCredit = !isDebited ? amount : 0;

            // Get counterparty (the other account)
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
            isDebitNormal, // Send this to help frontend display
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