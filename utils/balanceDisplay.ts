// utils/balanceDisplay.ts
/**
 * Utility to format balance with Dr/Cr suffix based on account type
 * 
 * ACCOUNTING RULES:
 * - Assets & Expenses: Debit normal (positive = Dr, negative = Cr)
 * - Liabilities & Income: Credit normal (positive = Cr, negative = Dr)
 * - Agent accounts are Credit normal (they owe us, so positive balance = Cr)
 * - Recipient accounts are Debit normal (we owe them, so positive balance = Dr)
 */

export interface BalanceDisplay {
  display: string;
  colorClass: string;
  isUnusualBalance: boolean;
}

const DEBIT_NORMAL_TYPES = ['asset', 'expense', 'cash', 'recipient'];
const CREDIT_NORMAL_TYPES = ['liability', 'income', 'agent'];

export function getBalanceDisplay(
  balance: number, 
  accountType: string
): BalanceDisplay {
  const isDebitNormal = DEBIT_NORMAL_TYPES.includes(accountType);
  
  // Determine if this is an unusual balance
  // Unusual = Debit normal account with credit balance OR Credit normal account with debit balance
  const isUnusualBalance = (isDebitNormal && balance < 0) || (!isDebitNormal && balance > 0);
  
  // Determine suffix
  const suffix = balance >= 0 ? 'Dr' : 'Cr';
  
  // Color coding
  let colorClass = 'text-gray-900';
  if (isUnusualBalance && balance !== 0) {
    colorClass = 'text-red-600'; // Red for unusual balances
  } else if (accountType === 'agent' && balance < 0) {
    colorClass = 'text-green-600'; // Green when agent has credit balance (normal)
  } else if (accountType === 'recipient' && balance > 0) {
    colorClass = 'text-blue-600'; // Blue when recipient has debit balance (normal)
  }
  
  return {
    display: `₹${Math.abs(balance).toLocaleString()} ${suffix}`,
    colorClass,
    isUnusualBalance
  };
}

/**
 * Get opening balance with proper sign based on account type
 * Opening balances should be stored as positive numbers and converted based on type
 */
export function getOpeningBalanceWithSign(
  openingBalance: number,
  accountType: string
): number {
  // Credit normal accounts store opening balance as negative
  if (CREDIT_NORMAL_TYPES.includes(accountType)) {
    return -Math.abs(openingBalance);
  }
  // Debit normal accounts store opening balance as positive
  return Math.abs(openingBalance);
}

/**
 * Format balance for agent cards (simplified display)
 */
export function formatAgentBalance(balance: number): {
  display: string;
  colorClass: string;
  status: 'owes' | 'clear' | 'advance';
} {
  // Agent balance: negative = they owe us (normal), positive = advance given
  if (balance < 0) {
    return {
      display: `₹${Math.abs(balance).toLocaleString()} Cr`,
      colorClass: 'text-green-600',
      status: 'owes'
    };
  } else if (balance > 0) {
    return {
      display: `₹${balance.toLocaleString()} Dr`,
      colorClass: 'text-red-600',
      status: 'advance'
    };
  } else {
    return {
      display: `₹0`,
      colorClass: 'text-gray-600',
      status: 'clear'
    };
  }
}

/**
 * Calculate closing balance from opening, debits, and credits
 */
export function calculateClosingBalance(
  opening: number,
  debits: number,
  credits: number,
  accountType: string
): number {
  // For all accounts: Balance = Opening + Debits - Credits
  return opening + debits - credits;
}