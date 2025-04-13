// import mongoose, { Schema, model, models } from "mongoose";

// const receiptSchema = new Schema(
//   {
//     agentId: {
//       type: Schema.Types.ObjectId,
//       ref: "Agent",
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     date: {
//       type: Date,
//       required: true,
//     },
//     note: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Receipt = models.Receipt || model("Receipt", receiptSchema);
// export default Receipt;

import mongoose, { Schema, model, models } from "mongoose";
const transactionSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    type: {
      type: String, 
      enum: ["receipt", "payment"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = models.Transaction || model("Transaction", transactionSchema);
export default Transaction;