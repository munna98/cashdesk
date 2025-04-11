import mongoose, { Schema, model, models } from "mongoose";

const receiptSchema = new Schema(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
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

const Receipt = models.Receipt || model("Receipt", receiptSchema);
export default Receipt;
