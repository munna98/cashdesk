import { useState } from "react";
import { agents } from "@/data/agents";
import {
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function AgentList() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const getCommissionStyle = (percent: number) => {
    if (percent >= 15) return "bg-green-100 text-green-800";
    if (percent >= 10) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

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
              key={agent.id}
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
                    agent.balance < 0
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  ₹{agent.balance.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Opening: ₹{agent.openingBalance.toLocaleString()}
                </div>
              </td>

              <td className="px-6 py-4 text-right relative">
                <button
                  onClick={() => toggleMenu(agent.id)}
                  className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>

                {activeMenu === agent.id && (
                  <div className="absolute right-6 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200 transition-all duration-150 ease-in-out">
                    <div className="py-1">
                      <a
                        href={`/agents/form?id=${agent.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </a>
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
