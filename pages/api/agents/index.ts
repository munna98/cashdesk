// // /pages/api/agents/index.ts

// import type { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/lib/mongodb";
// import Agent from "@/models/Agent";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   await dbConnect();

//   switch (req.method) {
//     case "GET":
//       try {
//         const agents = await Agent.find({});
//         return res.status(200).json(agents);
//       } catch (err: any) {
//         return res.status(500).json({ error: err.message });
//       }

//     case "POST":
//       try {
//         const agent = await Agent.create(req.body);
//         return res.status(201).json(agent);
//       } catch (err: any) {
//         return res.status(400).json({ error: err.message });
//       }

//     default:
//       return res.status(405).json({ message: "Method Not Allowed" });
//   }
// }


// /pages/api/agents/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Agent from "@/models/Agent";
import Account from "@/models/Account";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const agents = await Agent.find({});
        return res.status(200).json(agents);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }

    case "POST":
      try {
        // Create the agent first
        const agent = await Agent.create(req.body);
        
        // Then create the associated account
        const account = await Account.create({
          name: req.body.name,
          type: 'agent',
          linkedEntityType: 'agent',
          linkedEntityId: agent._id, // Link to the newly created agent
          balance: 0
        });
        
        // Return the created agent with the account information
        return res.status(201).json({
          agent,
          account
        });
      } catch (err: any) {
        // If we have an agent ID but the account creation failed, try to clean up
        if (req.body._id) {
          try {
            await Agent.findByIdAndDelete(req.body._id);
          } catch (cleanupErr) {
            console.error("Failed to clean up agent after error:", cleanupErr);
          }
        }
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}