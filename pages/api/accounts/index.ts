import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Account from "@/models/Account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const { type } = req.query;
        const filter: any = {};
    
        if (type) {
          filter.type = type;
        }
    
        const accounts = await Account.find(filter);
        return res.status(200).json(accounts);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }

    case "POST":
      try {
        // Validate required fields
        if (!req.body.name || !req.body.type) {
          return res.status(400).json({ 
            error: "Missing required fields: name and type are required" 
          });
        }

        // Validate type is one of the allowed values
        const allowedTypes = ['agent', 'recipient', 'cash', 'commission', 'employee', 'expense'];
        if (!allowedTypes.includes(req.body.type)) {
          return res.status(400).json({ 
            error: `Invalid account type. Must be one of: ${allowedTypes.join(', ')}` 
          });
        }

        // Create the account
        const account = await Account.create(req.body);
        return res.status(201).json(account);
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}