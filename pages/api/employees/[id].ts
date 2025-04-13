// /pages/api/employees/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        return res.status(200).json(employee);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    case "PUT":
      try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!updatedEmployee) {
          return res.status(404).json({ message: "Employee not found" });
        }

        return res.status(200).json(updatedEmployee);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    case "DELETE":
      try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
          return res.status(404).json({ message: "Employee not found" });
        }

        return res
          .status(200)
          .json({ message: "Employee deleted successfully" });
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
