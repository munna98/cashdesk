// pages/api/transactions/[id].ts - Updated with cascade delete
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  try {
    const transaction = await Transaction.findById(id)
      .populate("fromAccount", "name")
      .populate("toAccount", "name");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    switch (method) {
      case "GET":
        return res.status(200).json(transaction);

      case "PUT": {
        const { fromAccount, toAccount, amount, date, note, commissionAmount } = req.body;

        if (!["receipt", "payment"].includes(transaction.type)) {
          return res.status(400).json({ message: "Invalid transaction type" });
        }

        // If updating a receipt, handle commission payment update
        if (transaction.type === "receipt") {
          const oldCommission = transaction.commissionAmount || 0;
          const newCommission = commissionAmount || 0;

          // Find existing commission payment for this receipt
          const existingCommissionPayment = await Transaction.findOne({
            note: { $regex: `Commission for receipt ${transaction.transactionNumber}` }
          });

          if (oldCommission > 0 && existingCommissionPayment) {
            if (newCommission > 0) {
              // Update existing commission payment
              existingCommissionPayment.amount = newCommission;
              existingCommissionPayment.date = date;
              await existingCommissionPayment.save();
            } else {
              // Delete commission payment if new commission is 0
              await existingCommissionPayment.deleteOne();
            }
          } else if (newCommission > 0) {
            // Create new commission payment if it didn't exist
            const commissionAccount = await Transaction.findOne({ name: "Commission" });
            if (commissionAccount) {
              const Counter = (await import("@/models/Counter")).default;
              const counter = await Counter.findByIdAndUpdate(
                { _id: "payment" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
              );
              const year = new Date().getFullYear();
              const commissionTxnNumber = `PMT-${year}-${counter.seq.toString().padStart(5, "0")}`;

              await Transaction.create({
                transactionNumber: commissionTxnNumber,
                fromAccount: toAccount, // cash account
                toAccount: commissionAccount._id,
                amount: newCommission,
                date,
                note: `Commission for receipt ${transaction.transactionNumber}`,
                type: "payment",
              });
            }
          }
        }

        // Update the main transaction
        transaction.fromAccount = fromAccount;
        transaction.toAccount = toAccount;
        transaction.amount = amount;
        transaction.date = date;
        transaction.note = note;
        if (transaction.type === "receipt") {
          transaction.commissionAmount = commissionAmount || 0;
        }

        const updated = await transaction.save();
        return res.status(200).json(updated);
      }

      case "DELETE": {
        // 🔥 CRITICAL: If deleting a receipt, also delete its commission payment
        if (transaction.type === "receipt" && transaction.commissionAmount > 0) {
          // Find and delete the related commission payment
          const commissionPayment = await Transaction.findOne({
            note: { $regex: `Commission for receipt ${transaction.transactionNumber}` },
            type: "payment"
          });

          if (commissionPayment) {
            await commissionPayment.deleteOne();
            console.log(`✅ Deleted commission payment ${commissionPayment.transactionNumber} for receipt ${transaction.transactionNumber}`);
          }
        }

        // Delete the main transaction
        await transaction.deleteOne();
        
        return res.status(200).json({ 
          message: `${transaction.type} deleted successfully`,
          deletedTransactions: transaction.type === "receipt" ? 2 : 1 // receipt + commission or just payment
        });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error: any) {
    console.error("Transaction API error:", error);
    return res.status(500).json({ error: error.message });
  }
}