// /pages/api/accounts/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Account from "@/models/Account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const account = await Account.findById(id);
        if (!account) return res.status(404).json({ message: "Account not found" });
        return res.status(200).json(account);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    case "PUT":
      try {
        const updated = await Account.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: "Account not found" });
        return res.status(200).json(updated);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    case "DELETE":
      try {
        const deleted = await Account.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Account not found" });
        return res.status(200).json({ message: "Account deleted successfully" });
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
