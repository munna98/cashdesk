import mongoose, { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionNumber: {
      type: String,
      required: true,
      unique: true,
    },
    fromAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    toAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    effectedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
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
  },
  {
    timestamps: true,
  }
);

const Transaction = models.Transaction || model("Transaction", transactionSchema);
export default Transaction;