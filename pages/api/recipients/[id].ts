// /pages/api/recipients/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Recipient from "@/models/Recipient";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const recipient = await Recipient.findById(id);
        if (!recipient)
          return res.status(404).json({ message: "Recipient not found" });
        return res.status(200).json(recipient);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    case "PUT":
      try {
        const updatedRecipient = await Recipient.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!updatedRecipient) {
          return res.status(404).json({ message: "Recipient not found" });
        }

        // Update the corresponding account if name is changed
        if (req.body.name) {
          await Account.findOneAndUpdate(
            {
              linkedEntityId: id,
              linkedEntityType: "recipient",
            },
            {
              name: req.body.name,
            }
          );
        }

        return res.status(200).json(updatedRecipient);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    case "DELETE":
      try {
        // Prevent deleting recipient with existing transactions
        const hasTransactions = await Transaction.exists({ agentId: id });
        if (hasTransactions) {
          return res.status(400).json({
            error: "Cannot delete recipient with existing transactions.",
          });
        }

        // Delete the recipient
        const deletedRecipient = await Recipient.findByIdAndDelete(id);
        if (!deletedRecipient) {
          return res.status(404).json({ message: "Recipient not found" });
        }

        // Delete linked account
        await Account.findOneAndDelete({
          linkedEntityId: id,
          linkedEntityType: "recipient",
        });

        return res.status(200).json({
          message: "Recipient and linked account deleted successfully",
        });
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
