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

        // 3️⃣ Build query
        const transactionsQuery = {
            $or: [{ fromAccount: id }, { toAccount: id }],
            ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        };

        const transactions = await Transaction.find(transactionsQuery)
            .sort({ date: 1, createdAt: 1 })
            .populate("fromAccount", "name type")
            .populate("toAccount", "name type");

        // 4️⃣ Determine how Dr/Cr affects this account type
        const debitIncreaseTypes = ["asset", "expense", "cash"];
        
        // Determines if a Debit makes the balance increase (True for Assets/Expenses)
        const isDebitPositive = debitIncreaseTypes.includes(account.type);
        
        // 5️⃣ Calculate opening balance (before startDate)
        let openingBalance = account.openingBalance || 0;

        // FIX: Start with the correct sign convention for the opening balance
        if (!isDebitPositive) {
            openingBalance = -openingBalance;
        }

        if (startDate) {
            const priorTxns = await Transaction.find({
                $or: [{ fromAccount: id }, { toAccount: id }],
                date: { $lt: new Date(startDate as string) },
            });

            openingBalance = priorTxns.reduce((balance, txn) => {
                const isDebit = txn.fromAccount.toString() === id;
                const amount = txn.amount;

                // Determine the correct adjustment sign for the running balance
                let adjustment: number;

                if (isDebit) {
                    // Account is credited (Money OUT for Asset/Expense, Money IN for Liability/Income)
                    // Must be NEGATIVE for Asset/Expense, Must be NEGATIVE for Liability/Income increase
                    adjustment = isDebitPositive ? -amount : -amount; // FIX: Ensure negative sign for Credit increase on Liability/Income
                } else {
                    // Account is debited (Money IN for Asset/Expense, Money OUT for Liability/Income)
                    // Must be POSITIVE for Asset/Expense, Must be POSITIVE for Liability/Income decrease
                    adjustment = isDebitPositive ? amount : amount; // FIX: Ensure positive sign for Debit decrease on Liability/Income
                }
                
                return balance + adjustment;

            }, openingBalance);
        }
        
        // 6️⃣ Process transactions with Dr/Cr and running balance
        let runningBalance = openingBalance;
        const ledgerEntries = transactions.map((txn) => {
            // isDebit: True if the current account is the FROM account (Credit side of journal)
            const isDebit = txn.fromAccount._id.toString() === id;
            const amount = txn.amount;

            // Determine Dr/Cr effect on running balance sign (Negative = Cr, Positive = Dr)
            let adjustment: number;

            // The balance sign should follow this rule:
            // Asset/Expense: Debit +ve, Credit -ve
            // Liability/Income: Debit +ve (decrease), Credit -ve (increase)

            if (isDebit) {
                // Account is credited (Increase for Income/Liability, Decrease for Asset/Expense)
                // Adjustment MUST be negative.
                adjustment = -amount; 
            } else {
                // Account is debited (Decrease for Income/Liability, Increase for Asset/Expense)
                // Adjustment MUST be positive.
                adjustment = amount;
            }
            
            runningBalance += adjustment;

            // Display logic for Debit/Credit columns (remains the same and is CORRECT)
            const entryDebit = !isDebit ? amount : 0;
            const entryCredit = isDebit ? amount : 0;

            return {
                _id: txn._id,
                date: txn.date,
                transactionNumber: txn.transactionNumber,
                note: txn.note,
                type: txn.type,
                fromAccount: txn.fromAccount,
                toAccount: txn.toAccount,
                counterparty: isDebit ? txn.toAccount.name : txn.fromAccount.name,
                debit: entryDebit,
                credit: entryCredit, 
                balance: runningBalance, // This will now be -1500 for the Commission Credit
            };
        });

        // 7️⃣ Prepare response
        const response = {
            accountName: account.name,
            accountType: account.type,
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