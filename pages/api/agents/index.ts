// /pages/api/agents/index.ts
import dbConnect from "@/lib/mongodb"
import Agent from "@/models/Agent"

export default async function handler(req, res) {
  await dbConnect()

  switch (req.method) {
    case "GET":
      const agents = await Agent.find({})
      return res.status(200).json(agents)

    case "POST":
      try {
        const agent = await Agent.create(req.body)
        return res.status(201).json(agent)
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }

    default:
      return res.status(405).json({ message: "Method Not Allowed" })
  }
}
