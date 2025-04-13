// /models/Recipient.ts
import mongoose from "mongoose";

const RecipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  email: String,
  mobile: String,
  openingBalance: Number,
}, { timestamps: true });

export default mongoose.models.Recipient || mongoose.model("Recipient", RecipientSchema);
