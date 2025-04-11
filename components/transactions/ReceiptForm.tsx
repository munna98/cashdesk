import { useState, useEffect } from "react";
import axios from "axios";
import {
  BanknotesIcon,
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

interface Agent {
  _id: string;
  name: string;
}

export default function ReceiptForm() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  // Load agents from backend
  useEffect(() => {
    axios
      .get("/api/agents")
      .then((res) => setAgents(res.data))
      .catch((err) => console.error("Failed to load agents", err));
  }, []);

  // Submit receipt to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const receipt = {
      agentId,
      amount: Number(amount),
      date,
      note,
    };

    try {
      const res = await axios.post("/api/receipts", receipt);
      console.log("Receipt saved:", res.data);
      alert("Receipt saved successfully!");

      // Reset form
      setAgentId("");
      setAmount("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Error saving receipt:", error);
      alert("Failed to save receipt.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
    >
      {/* Agent Select */}
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
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amount */}
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

      {/* Date */}
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

      {/* Note */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <div className="relative">
          <PencilSquareIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Save Receipt
        </button>
      </div>
    </form>
  );
}
