// utils/calculateBalance.ts
import Transaction from "../models/Transaction";

export const calculateBalance = async (accountId: string) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        $or: [
          { debitAccount: accountId },  // UPDATED: Check debitAccount
          { creditAccount: accountId } // UPDATED: Check creditAccount
        ]
      }
    },
    {
      $group: {
        _id: null,
        debit: {
          $sum: {
            $cond: [{ $eq: ["$debitAccount", accountId] }, "$amount", 0] // UPDATED: Sum amount when account is debited
          }
        },
        credit: {
          $sum: {
            $cond: [{ $eq: ["$creditAccount", accountId] }, "$amount", 0] // UPDATED: Sum amount when account is credited
          }
        }
      }
    }
  ]);

  const { debit = 0, credit = 0 } = result[0] || {};
  return debit - credit; // positive = net debit balance, negative = net credit balance (owed)
};