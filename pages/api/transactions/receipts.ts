// // /pages/api/transactions/recent-receipts.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/lib/mongodb";
// import Transaction from "@/models/Transaction";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();

//   try {
//     const receipts = await Transaction.find({ type: "receipt" })
//       // Option A: sort by date field
//       // .sort({ date: -1 })

//       // ✅ Option B (recommended): sort by creation time (most accurate)
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("accountId", "name");

//     const formatted = receipts.map((t) => ({
//       _id: t._id,
//       amount: t.amount,
//       date: t.date,
//       account: {
//         name: t.accountId?.name || "Unknown",
//       },
//     }));

//     res.status(200).json(formatted);
//   } catch (err: any) {
//     console.error("Error fetching receipts:", err);
//     res.status(500).json({ error: "Failed to fetch receipts" });
//   }
// }


// Modified /pages/api/transactions/receipts.ts


import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const receipts = await Transaction.find({ type: "receipt" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("accountId", "name");

    const formatted = receipts.map((t) => ({
      _id: t._id,
      transactionNumber: t.transactionNumber,
      note: t.note,
      amount: t.amount,
      date: t.date,
      account: {
        name: t.accountId?.name || "Unknown",
      },
    }));

    res.status(200).json(formatted);
  } catch (err: any) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
}