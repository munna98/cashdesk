

// import mongoose, { Schema, model, models } from "mongoose";

// const transactionSchema = new Schema(
//   {
//     accountId: {
//       type: Schema.Types.ObjectId,
//       ref: "Account",
//       required: true,
//     },
//     type: {
//       type: String, 
//       enum: ["receipt", "payment"],
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

// const Transaction = models.Transaction || model("Transaction", transactionSchema);
// export default Transaction;


import mongoose, { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionNumber: {
      type: String,
      required: true,
      unique: true,
    },
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