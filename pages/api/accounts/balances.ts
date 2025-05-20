// pages/api/accounts/balances.ts 
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "POST":
      try {
        const { accountIds } = req.body;

        // Validate
        if (!Array.isArray(accountIds) || accountIds.length === 0) {
          return res.status(400).json({
            error: "accountIds must be a non-empty array",
          });
        }

        // Convert string IDs to ObjectIds
        const objectIds = accountIds.map((id) => 
          typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
        );
        
        // Get account details with opening balances
        const accounts = await Account.find({ _id: { $in: objectIds } });
        
        // Initialize balances with opening balances
        const balances: Record<string, number> = {};
        
        for (const account of accounts) {
          const accountId = account._id.toString();
          // Set initial balance based on opening balance and type
          const openingAmount = account.openingBalance || 0;
          
          balances[accountId] = account.openingType === 'debit' 
            ? -openingAmount 
            : openingAmount;
        }
        
        // Calculate transactions in one go with aggregation
        const transactionAggregation = await Transaction.aggregate([
          {
            $match: {
              $or: [
                { fromAccount: { $in: objectIds } },
                { toAccount: { $in: objectIds } }
              ]
            }
          },
          {
            $facet: {
              receipts: [
                { $match: { toAccount: { $in: objectIds } } },
                { $group: { _id: "$toAccount", total: { $sum: "$amount" } } }
              ],
              payments: [
                { $match: { fromAccount: { $in: objectIds } } },
                { $group: { _id: "$fromAccount", total: { $sum: "$amount" } } }
              ]
            }
          }
        ]);

        // Extract results
        const receipts = transactionAggregation[0]?.receipts || [];
        const payments = transactionAggregation[0]?.payments || [];
        
        // Apply receipts to balances
        for (const item of receipts) {
          const accountId = item._id.toString();
          balances[accountId] = (balances[accountId] || 0) + item.total;
        }
        
        // Apply payments to balances
        for (const item of payments) {
          const accountId = item._id.toString();
          balances[accountId] = (balances[accountId] || 0) - item.total;
        }

        return res.status(200).json(balances);
      } catch (err: any) {
        console.error("Error calculating balances:", err);
        return res.status(500).json({ error: err.message });
      }
    
    case "GET":
      try {
        // Get all accounts
        const accounts = await Account.find({});
        const accountIds = accounts.map((account) => account._id);
        
        // Initialize balances with opening balances
        const balancesData = accounts.map((account) => {
          const openingAmount = account.openingBalance || 0;
          const initialBalance = account.openingType === 'debit' ? -openingAmount : openingAmount;
          
          return {
            _id: account._id,
            name: account.name,
            type: account.type,
            balance: initialBalance
          };
        });
        
        // Create a lookup object for easy access
        const balancesLookup: Record<string, any> = {};
        for (const account of balancesData) {
          balancesLookup[account._id.toString()] = account;
        }
        
        // Get all transactions in a single aggregation
        const transactionAggregation = await Transaction.aggregate([
          {
            $facet: {
              receipts: [
                { $group: { _id: "$toAccount", total: { $sum: "$amount" } } }
              ],
              payments: [
                { $group: { _id: "$fromAccount", total: { $sum: "$amount" } } }
              ]
            }
          }
        ]);
        
        // Extract results
        const receipts = transactionAggregation[0]?.receipts || [];
        const payments = transactionAggregation[0]?.payments || [];
        
        // Apply receipts to balances
        for (const item of receipts) {
          const accountId = item._id.toString();
          if (balancesLookup[accountId]) {
            balancesLookup[accountId].balance += item.total;
          }
        }
        
        // Apply payments to balances
        for (const item of payments) {
          const accountId = item._id.toString();
          if (balancesLookup[accountId]) {
            balancesLookup[accountId].balance -= item.total;
          }
        }

        return res.status(200).json({
          accounts: balancesData,
          success: true
        });
      } catch (err: any) {
        console.error("Error calculating all balances:", err);
        return res.status(500).json({ error: err.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}