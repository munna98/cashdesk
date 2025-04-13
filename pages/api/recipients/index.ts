// /pages/api/recipients/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Recipient from "@/models/Recipient";
import Account from "@/models/Account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const recipients = await Recipient.find({});
        return res.status(200).json(recipients);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }

    case "POST":
      try {
        // Create the recipient first
        const recipient = await Recipient.create(req.body);

        // Then create the associated account
        const account = await Account.create({
          name: req.body.name,
          type: "recipient",
          linkedEntityType: "recipient",
          linkedEntityId: recipient._id,
          balance: 0,
        });

        return res.status(201).json({
          recipient,
          account,
        });
      } catch (err: any) {
        // Clean up partially created recipient if necessary
        if (req.body._id) {
          try {
            await Recipient.findByIdAndDelete(req.body._id);
          } catch (cleanupErr) {
            console.error("Failed to clean up recipient after error:", cleanupErr);
          }
        }
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
