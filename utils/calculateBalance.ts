// utils/calculateBalance.ts
import Transaction from "../models/Transaction";

export const calculateBalance = async (accountId: string) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        $or: [
          { fromAccount: accountId },
          { toAccount: accountId }
        ]
      }
    },
    {
      $group: {
        _id: null,
        debit: {
          $sum: {
            $cond: [{ $eq: ["$toAccount", accountId] }, "$amount", 0]
          }
        },
        credit: {
          $sum: {
            $cond: [{ $eq: ["$fromAccount", accountId] }, "$amount", 0]
          }
        }
      }
    }
  ]);

  const { debit = 0, credit = 0 } = result[0] || {};
  return debit - credit; // positive = balance in favor, negative = owed
};
