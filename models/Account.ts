import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['agent', 'recipient', 'cash', 'income', 'employee', 'expense'],
    required: true
  },
  linkedEntityType: {
    type: String,
    enum: ['agent', 'recipient', 'employee', null],
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
}, { timestamps: true });

const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);

// ✅ Auto-create default accounts (Cash & Commission)
(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Create Cash Account if not exists
      const cash = await Account.findOne({ type: "cash" });
      if (!cash) {
        await Account.create({
          name: "Cash Account",
          type: "cash"
        });
        console.log("✅ Cash Account created");
      }

      // Create Commission Account under Income if not exists
      const commission = await Account.findOne({ name: "Commission", type: "income" });
      if (!commission) {
        await Account.create({
          name: "Commission",
          type: "income"
        });
        console.log("✅ Commission Account created");
      }
    }
  } catch (err) {
    console.error("Error setting up default accounts:", err);
  }
})();

export default Account;
