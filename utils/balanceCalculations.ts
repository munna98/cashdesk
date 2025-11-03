// utils/balanceCalculations.ts
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";

/**
 * Calculate account balance excluding opening balance journal
 * Opening balance is stored in account.openingBalance
 * This calculates additional movements
 */
export async function calculateAccountBalance(
  accountId: string,
  upToDate?: Date
): Promise<number> {
  const account = await Account.findById(accountId);
  if (!account) return 0;

  // Start with stored opening balance
  let balance = account.openingBalance || 0;

  // Build query
  const query: any = {
    $or: [
      { debitAccount: accountId },
      { creditAccount: accountId }
    ],
    // Exclude opening balance journals
    note: { $not: /^Opening balance for/ }
  };

  // If date specified, only get transactions up to that date
  if (upToDate) {
    query.date = { $lte: upToDate };
  }

  const transactions = await Transaction.find(query);

  // Calculate movements
  transactions.forEach((txn) => {
    const isDebited = txn.debitAccount.toString() === accountId;
    const isCredited = txn.creditAccount.toString() === accountId;

    if (isDebited) {
      balance += txn.amount;  // Debit increases debit accounts, decreases credit accounts
    } else if (isCredited) {
      balance -= txn.amount;  // Credit increases credit accounts, decreases debit accounts
    }
  });

  return balance;
}

/**
 * Calculate opening balance for a specific date
 * = stored opening balance + transactions before that date (excluding opening journal)
 */
export async function calculateOpeningBalance(
  accountId: string,
  asOfDate: Date
): Promise<number> {
  const account = await Account.findById(accountId);
  if (!account) return 0;

  // Start with stored opening balance
  let opening = account.openingBalance || 0;

  // Get transactions BEFORE the specified date
  const startOfDay = new Date(asOfDate);
  startOfDay.setHours(0, 0, 0, 0);

  const transactions = await Transaction.find({
    $or: [
      { debitAccount: accountId },
      { creditAccount: accountId }
    ],
    date: { $lt: startOfDay },
    // Exclude opening balance journals
    note: { $not: /^Opening balance for/ }
  });

  // Calculate movements before the date
  transactions.forEach((txn) => {
    const isDebited = txn.debitAccount.toString() === accountId;
    const isCredited = txn.creditAccount.toString() === accountId;

    if (isDebited) {
      opening += txn.amount;
    } else if (isCredited) {
      opening -= txn.amount;
    }
  });

  return opening;
}

/**
 * Calculate day's transactions for an account
 */
export async function calculateDayTransactions(
  accountId: string,
  date: Date
): Promise<{
  receipts: number;
  payments: number;
  commission: number;
  cancelled: number;
}> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const transactions = await Transaction.find({
    $or: [
      { debitAccount: accountId },
      { creditAccount: accountId }
    ],
    date: { $gte: startOfDay, $lte: endOfDay }
  }).populate('debitAccount creditAccount');

  let receipts = 0;
  let payments = 0;
  let commission = 0;
  let cancelled = 0;

  transactions.forEach((txn: any) => {
    const isCredited = txn.creditAccount._id.toString() === accountId;
    const isDebited = txn.debitAccount._id.toString() === accountId;

    if (txn.type === 'receipt' && isCredited) {
      receipts += txn.amount;
    } else if (txn.type === 'journalentry' && isDebited) {
      if (txn.creditAccount.type === 'income' && txn.creditAccount.name === 'Commission') {
        commission += txn.amount;
      } else if (txn.creditAccount.type === 'recipient') {
        payments += txn.amount;
      }
    } else if (txn.type === 'payment' && isCredited && txn.note?.toLowerCase().includes('cancelled')) {
      cancelled += txn.amount;
    }
  });

  return { receipts, payments, commission, cancelled };
}