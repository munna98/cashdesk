// import type { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/lib/mongodb";
// import Transaction from "@/models/Transaction";
// import { ITransaction } from "@/types/transaction";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   await dbConnect();

//   switch (req.method) {
//     case "GET":
//       try {
//         const transactions: ITransaction[] = await Transaction.find().populate("accountId", "name");
//         return res.status(200).json(transactions);
//       } catch (error: any) {
//         return res.status(500).json({ error: error.message });
//       }

//     case "POST":
//       try {
//         const { accountId, amount, date, note, type } = req.body;

//         if (!accountId || !amount || !date) {
//           return res.status(400).json({ message: "Missing required fields" });
//         }

//         const newTransaction: ITransaction = await Transaction.create({
//           accountId,
//           amount,
//           date,
//           note,
//           type,
//         });

//         return res.status(201).json(newTransaction);
//       } catch (error: any) {
//         return res.status(500).json({ error: error.message });
//       }

//     default:
//       res.setHeader("Allow", ["GET", "POST"]);
//       return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Counter from "@/models/Counter";
import { ITransaction } from "@/types/transaction";

async function getNextSequence(name: string) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const transactions: ITransaction[] = await Transaction.find().populate(
          "accountId",
          "name"
        );
        return res.status(200).json(transactions);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const { accountId, amount, date, note, type } = req.body;

        if (!accountId || !amount || !date) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Generate the next transaction number
        // Use separate counters for receipts and payments
        const counterKey = type === "receipt" ? "receipt" : "payment";
        const seq = await getNextSequence(counterKey);

        // Format it in a user-friendly way (e.g., RCT-2025-00001)
        const year = new Date().getFullYear();
        const prefix = type === "receipt" ? "RCT" : "PMT";
        const transactionNumber = `${prefix}-${year}-${seq
          .toString()
          .padStart(5, "0")}`;

        const newTransaction: ITransaction = await Transaction.create({
          transactionNumber,
          accountId,
          amount,
          date,
          note,
          type,
        });

        return res.status(201).json(newTransaction);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
  }
}
