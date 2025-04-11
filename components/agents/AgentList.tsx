import { useEffect, useState } from "react";
import axios from "axios";
import {
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import AgentActionsMenu from "../AgentActionsMenu";
type Agent = {
  _id: string;
  name: string;
  address: string;
  mobile: string;
  email: string;
  commPercent: number;
  openingBalance: number;
  balance: number;
};

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get("/api/agents");
        setAgents(res.data);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      try {
        await axios.delete(`/api/agents/${id}`);
        setAgents((prev) => prev.filter((agent) => agent._id !== id));
      } catch (error) {
        console.error("Failed to delete agent:", error);
        alert("Failed to delete agent.");
      }
    }
  };

  const getCommissionStyle = (percent: number) => {
    if (percent >= 15) return "bg-green-100 text-green-800";
    if (percent >= 10) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading agents...</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
      <table className="w-full bg-white rounded-t-lg">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-6 py-3 text-left">Agent</th>
            <th className="px-6 py-3 text-left">Contact</th>
            <th className="px-6 py-3 text-left">Commission</th>
            <th className="px-6 py-3 text-right">Balance</th>
            <th className="px-6 py-3 text-center w-16">Actions</th>
          </tr>
        </thead>

        <tbody>
          {agents.map((agent, index) => (
            <tr
              key={agent._id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition-colors`}
            >
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{agent.name}</div>
                <div
                  className="text-sm text-gray-500 truncate max-w-xs mt-1"
                  title={agent.address}
                >
                  {agent.address}
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{agent.mobile}</span>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span title={agent.email}>{agent.email}</span>
                </div>
              </td>

              <td className="px-6 py-4">
                <div
                  className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${getCommissionStyle(
                    agent.commPercent
                  )}`}
                >
                  {agent.commPercent}%
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                <div
                  className={`font-medium ${
                    agent.balance < 0 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  ₹{agent.balance?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Opening: ₹{agent.openingBalance.toLocaleString()}
                </div>
              </td>

              <td className="px-6 py-4 text-right relative">
                <button
                  onClick={() => toggleMenu(agent._id)}
                  className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>

                {activeMenu === agent._id && (
                  <AgentActionsMenu
                    agentId={agent._id}
                    onDelete={handleDelete}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
