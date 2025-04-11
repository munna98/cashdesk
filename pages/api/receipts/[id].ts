import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Receipt from "@/models/Receipt";
import { IReceipt } from "@/types/receipt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const receipt: IReceipt | null = await Receipt.findById(id).populate("agentId", "name");
        if (!receipt) {
          return res.status(404).json({ message: "Receipt not found" });
        }
        return res.status(200).json(receipt);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "PUT":
      try {
        const { agentId, amount, date, note } = req.body;

        const updatedReceipt: IReceipt | null = await Receipt.findByIdAndUpdate(
          id,
          { agentId, amount, date, note },
          { new: true, runValidators: true }
        );

        if (!updatedReceipt) {
          return res.status(404).json({ message: "Receipt not found" });
        }

        return res.status(200).json(updatedReceipt);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    case "DELETE":
      try {
        const deleted: IReceipt | null = await Receipt.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({ message: "Receipt not found" });
        }
        return res.status(200).json({ message: "Receipt deleted successfully" });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res
        .status(405)
        .json({ message: `Method ${method} Not Allowed` });
  }
}
