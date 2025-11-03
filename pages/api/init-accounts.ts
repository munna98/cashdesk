// pages/api/init-accounts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Account, { setupDefaultAccounts } from "@/models/Account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    await setupDefaultAccounts();

    const accounts = await Account.find({}, "name type balance");

    return res.status(200).json({
      success: true,
      message: "Default accounts verified/created successfully",
      accounts,
    });
  } catch (err: unknown) {
    console.error("❌ Error initializing accounts:", err);

    // Type guard for error
    if (err instanceof Error) {
      return res.status(500).json({ success: false, error: err.message });
    }

    return res.status(500).json({
      success: false,
      error: "An unknown error occurred",
    });
  }
}
