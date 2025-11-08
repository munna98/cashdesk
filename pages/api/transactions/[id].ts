// pages/api/transactions/[id].ts - Updated PUT handler for payments
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  try {
    const transaction = await Transaction.findById(id)
      .populate("debitAccount", "name type")
      .populate("creditAccount", "name type");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    switch (method) {
      case "GET":
        return res.status(200).json(transaction);

      case "PUT": {
        const { debitAccount, creditAccount, amount, date, note, effectedAccount } = req.body;

        if (!["receipt", "payment", "journalentry"].includes(transaction.type)) {
          return res.status(400).json({ message: "Invalid transaction type" });
        }

        // ============= PAYMENT HANDLING =============
        if (transaction.type === "payment") {
          // Get the old debit account to check if it was a recipient payment
          const oldDebitAccount = await Account.findById(transaction.debitAccount);
          const newDebitAccount = await Account.findById(debitAccount);
          
          const wasRecipientPayment = oldDebitAccount?.type === "recipient";
          const isRecipientPayment = newDebitAccount?.type === "recipient";

          // Update the main payment transaction
          transaction.debitAccount = debitAccount;
          transaction.creditAccount = creditAccount;
          transaction.amount = amount;
          transaction.date = date;
          transaction.note = note;

          await transaction.save();

          // Handle related clearing journal
          if (wasRecipientPayment || isRecipientPayment) {
            // Find existing related journal
            const relatedJournal = await Transaction.findOne({
              relatedTransactionId: transaction._id,
              type: "journalentry"
            });

            if (relatedJournal) {
              if (!isRecipientPayment) {
                // Changed from recipient to non-recipient: delete journal
                await relatedJournal.deleteOne();
                transaction.relatedTransactionId = null;
                await transaction.save();
              } else {
                // Update existing journal
                if (effectedAccount) {
                  relatedJournal.debitAccount = effectedAccount;  // Agent (Dr)
                  relatedJournal.creditAccount = debitAccount;     // Recipient (Cr)
                  relatedJournal.amount = amount;
                  relatedJournal.date = date;
                  relatedJournal.note = `Agent clearing for payment ${transaction.transactionNumber}`;
                  await relatedJournal.save();
                } else {
                  return res.status(400).json({ 
                    error: "effectedAccount is required for recipient payments" 
                  });
                }
              }
            } else if (isRecipientPayment) {
              // Create new journal for new recipient payment
              if (!effectedAccount) {
                return res.status(400).json({ 
                  error: "effectedAccount is required for recipient payments" 
                });
              }

              const Counter = (await import("@/models/Counter")).default;
              const counter = await Counter.findByIdAndUpdate(
                { _id: "journalentry" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
              );
              
              const year = new Date().getFullYear();
              const journalNumber = `JNL-${year}-${counter.seq.toString().padStart(5, "0")}`;

              const newJournal = await Transaction.create({
                transactionNumber: journalNumber,
                debitAccount: effectedAccount,   // Agent (Dr)
                creditAccount: debitAccount,     // Recipient (Cr)
                amount,
                date,
                note: `Agent clearing for payment ${transaction.transactionNumber}`,
                type: "journalentry",
                relatedTransactionId: transaction._id,
              });

              transaction.relatedTransactionId = newJournal._id;
              await transaction.save();
            }
          }

          return res.status(200).json(transaction);
        }

        // ============= RECEIPT HANDLING =============
        if (transaction.type === "receipt") {
          const oldCommission = transaction.commissionAmount || 0;
          const newCommission = req.body.commissionAmount || 0;

          // Update main transaction
          transaction.debitAccount = debitAccount;
          transaction.creditAccount = creditAccount;
          transaction.amount = amount;
          transaction.date = date;
          transaction.note = note;
          transaction.commissionAmount = newCommission;

          await transaction.save();

          // Handle commission journal
          const relatedJournal = await Transaction.findOne({
            relatedTransactionId: transaction._id,
            type: "journalentry"
          });

          if (relatedJournal) {
            if (newCommission > 0) {
              // Update existing commission journal
              relatedJournal.amount = newCommission;
              relatedJournal.date = date;
              await relatedJournal.save();
            } else {
              // Delete commission journal if new commission is 0
              await relatedJournal.deleteOne();
              transaction.relatedTransactionId = null;
              await transaction.save();
            }
          } else if (newCommission > 0) {
            // Create new commission journal
            const commissionAccount = await Account.findOne({
              name: "Commission",
              type: "income"
            });

            if (commissionAccount) {
              const Counter = (await import("@/models/Counter")).default;
              const counter = await Counter.findByIdAndUpdate(
                { _id: "journalentry" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
              );
              
              const year = new Date().getFullYear();
              const journalNumber = `JNL-${year}-${counter.seq.toString().padStart(5, "0")}`;

              const newJournal = await Transaction.create({
                transactionNumber: journalNumber,
                debitAccount: creditAccount,           // Agent (Dr)
                creditAccount: commissionAccount._id,  // Commission (Cr)
                amount: newCommission,
                date,
                note: `Commission for receipt ${transaction.transactionNumber}`,
                type: "journalentry",
                relatedTransactionId: transaction._id,
              });

              transaction.relatedTransactionId = newJournal._id;
              await transaction.save();
            }
          }

          return res.status(200).json(transaction);
        }

        // ============= JOURNAL ENTRY HANDLING =============
        if (transaction.type === "journalentry") {
          transaction.debitAccount = debitAccount;
          transaction.creditAccount = creditAccount;
          transaction.amount = amount;
          transaction.date = date;
          transaction.note = note;

          const updated = await transaction.save();
          return res.status(200).json(updated);
        }

        return res.status(400).json({ message: "Invalid transaction type" });
      }

      case "DELETE": {
        let deletedCount = 1;

        // Find and delete related transaction
        if (transaction.relatedTransactionId) {
          const relatedTxn = await Transaction.findById(transaction.relatedTransactionId);
          
          if (relatedTxn) {
            await relatedTxn.deleteOne();
            deletedCount++;
            console.log(`✅ Deleted related ${relatedTxn.type} ${relatedTxn.transactionNumber}`);
          }
        }

        // Check if this transaction is referenced by another
        const referencingTxn = await Transaction.findOne({
          relatedTransactionId: transaction._id
        });
        
        if (referencingTxn) {
          await referencingTxn.deleteOne();
          deletedCount++;
          console.log(`✅ Deleted referencing ${referencingTxn.type} ${referencingTxn.transactionNumber}`);
        }

        // Delete the main transaction
        await transaction.deleteOne();
        
        return res.status(200).json({ 
          message: `${transaction.type} deleted successfully`,
          deletedTransactions: deletedCount,
          deletedTypes: [
            transaction.type,
            ...(deletedCount > 1 ? ["related journal entry"] : [])
          ]
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