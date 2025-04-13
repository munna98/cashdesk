// /pages/api/employees/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";
import Account from "@/models/Account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const employees = await Employee.find({});
        return res.status(200).json(employees);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }

    case "POST":
      try {
        // Create the employee first
        const employee = await Employee.create(req.body);

        // Then create the associated account
        const account = await Account.create({
          name: req.body.name,
          type: "employee",
          linkedEntityType: "employee",
          linkedEntityId: employee._id,
          balance: 0,
        });

        return res.status(201).json({
          employee,
          account,
        });
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
