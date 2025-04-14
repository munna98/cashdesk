// // /api/transactions/[id].ts
// import { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/lib/mongodb";
// import Receipt from "@/models/Transaction";
// import { ITransaction } from "@/types/transaction";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   await dbConnect();

//   const {
//     query: { id },
//     method,
//   } = req;

//   switch (method) {
//     case "GET":
//       try {
//         const receipt: ITransaction | null = await Receipt.findById(id).populate("agentId", "name");
//         if (!receipt) {
//           return res.status(404).json({ message: "Receipt not found" });
//         }
//         return res.status(200).json(receipt);
//       } catch (error: any) {
//         return res.status(500).json({ error: error.message });
//       }

//     case "PUT":
//       try {
//         const { agentId, amount, date, note } = req.body;

//         const updatedReceipt: ITransaction | null = await Receipt.findByIdAndUpdate(
//           id,
//           { agentId, amount, date, note },
//           { new: true, runValidators: true }
//         );

//         if (!updatedReceipt) {
//           return res.status(404).json({ message: "Receipt not found" });
//         }

//         return res.status(200).json(updatedReceipt);
//       } catch (error: any) {
//         return res.status(500).json({ error: error.message });
//       }

//     case "DELETE":
//       try {
//         const deleted: ITransaction | null = await Receipt.findByIdAndDelete(id);
//         if (!deleted) {
//           return res.status(404).json({ message: "Receipt not found" });
//         }
//         return res.status(200).json({ message: "Receipt deleted successfully" });
//       } catch (error: any) {
//         return res.status(500).json({ error: error.message });
//       }

//     default:
//       res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
//       return res
//         .status(405)
//         .json({ message: `Method ${method} Not Allowed` });
//   }
// }



import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { ITransaction } from "@/types/transaction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  try {
    // const transaction: ITransaction | null = await Transaction.findById(id).populate("accountId", "name");
    const transaction = await Transaction.findById(id).populate("accountId", "name");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.type !== "receipt") {
      return res.status(400).json({ message: "Invalid operation: Not a receipt" });
    }

    switch (method) {
      case "GET":
        return res.status(200).json(transaction);

      case "PUT": {
        const { accountId, amount, date, note } = req.body;

        transaction.accountId = accountId;
        transaction.amount = amount;
        transaction.date = date;
        transaction.note = note;

        const updated = await transaction.save();
        return res.status(200).json(updated);
      }

      case "DELETE":
        await transaction.deleteOne();
        return res.status(200).json({ message: "Receipt deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
