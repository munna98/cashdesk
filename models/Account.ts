import mongoose from "mongoose";

/* ----------------------  SCHEMA DEFINITION  ---------------------- */
const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: [
        "agent",
        "recipient",
        "cash",
        "income",
        "employee",
        "expense",
        "equity", // ✅ For Opening Balance & Capital accounts
      ],
      required: true,
    },
    linkedEntityType: {
      type: String,
      enum: ["agent", "recipient", "employee", null],
      default: null,
    },
    linkedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    isSystem: {
      type: Boolean,
      default: false, // ✅ Helps you identify system-created accounts
    },
  },
  { timestamps: true }
);

/* ----------------------  MODEL CREATION  ---------------------- */
const Account =
  mongoose.models.Account || mongoose.model("Account", AccountSchema);

/* ----------------------  DEFAULT ACCOUNT SETUP  ---------------------- */
export async function setupDefaultAccounts() {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ Mongoose not connected. Default accounts not created.");
      return;
    }

    const defaults = [
      { name: "Cash Account", type: "cash", isSystem: true },
      { name: "Commission", type: "income", isSystem: true },
      { name: "Opening Balance", type: "equity", isSystem: true },
    ];

    for (const acc of defaults) {
      const exists = await Account.findOne({ name: acc.name, type: acc.type });
      if (!exists) {
        await Account.create(acc);
        console.log(`✅ Created system account: ${acc.name}`);
      }
    }
  } catch (err) {
    console.error("❌ Error setting up default accounts:", err);
  }
}

/* ----------------------  EXPORT MODEL  ---------------------- */
export default Account;
