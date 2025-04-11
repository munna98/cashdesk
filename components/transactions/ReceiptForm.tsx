import { useState } from "react"
import { agents } from "@/data/agents"
import { BanknotesIcon, CalendarIcon, UserCircleIcon } from "@heroicons/react/24/outline"

export default function ReceiptForm() {
  const [agentId, setAgentId] = useState("")
  const [amount, setAmount] = useState("")
  const [commission, setCommission] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const receipt = {
      agentId,
      amount: Number(amount),
      commission: Number(commission || 0),
      date,
    }
    console.log("Receipt saved:", receipt)
    alert("Receipt saved!")

    setAgentId("")
    setAmount("")
    setCommission("")
    setDate(new Date().toISOString().split("T")[0])
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
    >
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Agent</label>
        <div className="relative">
          <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
          <select
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Select Agent --</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Amount Received</label>
        <div className="relative">
          <BanknotesIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter amount"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Commission (Optional)</label>
        <div className="relative">
          <BanknotesIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
          <input
            type="number"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter commission"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <div className="relative">
          <CalendarIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Save Receipt
        </button>
      </div>
    </form>
  )
}
