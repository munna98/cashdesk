import mongoose from "mongoose"

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['agent', 'recipient', 'cash', 'income', 'employee', 'expense', 'other'],
    required: true
  },
  linkedEntityType: {
    type: String,
    enum: ['agent', 'recipient', 'employee' , null],
    default: null
  },
  linkedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  balance: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export default mongoose.models.Account || mongoose.model("Account", AccountSchema)
