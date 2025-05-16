// /models/Agent.ts
import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  address: String,
  email: String,
  mobile: String,
  commPercent: Number,
  openingBalance: Number,
}, { timestamps: true });

export default mongoose.models.Agent || mongoose.model("Agent", AgentSchema);
 