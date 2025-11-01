// models/Transaction.ts - Updated with debit/credit terminology
import mongoose, { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionNumber: {
      type: String,
      required: true,
      unique: true,
    },
    // UPDATED: Changed from fromAccount/toAccount to debitAccount/creditAccount
    debitAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    creditAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    commissionAmount: { 
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["receipt", "payment", "journalentry"],
      required: true,
    },
    // Link related transactions (receipt <-> commission journal)
    relatedTransactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = models.Transaction || model("Transaction", transactionSchema);
export default Transaction;

/**
 * ACCOUNTING RULES:
 * 
 * RECEIPT (Dr Cash | Cr Agent):
 *   debitAccount: Cash Account
 *   creditAccount: Agent Account
 * 
 * PAYMENT (Dr Expense/Recipient | Cr Cash):
 *   debitAccount: Expense/Recipient Account
 *   creditAccount: Cash Account
 * 
 * JOURNAL ENTRY:
 *   debitAccount: Account being debited
 *   creditAccount: Account being credited
 * 
 * COMMISSION (Dr Agent | Cr Commission Income):
 *   debitAccount: Agent Account
 *   creditAccount: Commission Income Account
 */