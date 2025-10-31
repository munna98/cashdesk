// components/agents/AgentList.tsx - Refactored with React Query
import { useRef, useState } from "react";
import {
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAgents, useDeleteAgent } from "@/hooks/queries/useAgents";

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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use React Query hooks
  const { data: agents = [], isLoading, isError, error } = useAgents();
  const deleteAgentMutation = useDeleteAgent();

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      await deleteAgentMutation.mutateAsync(id);
      // No need to manually update state - React Query handles cache invalidation
    } catch (error: any) {
      console.error("Failed to delete agent:", error);
      alert(error.response?.data?.error || "Failed to delete agent.");
    }
  };

  const getCommissionStyle = (percent: number) => {
    if (percent >= 15) return "bg-green-100 text-green-800";
    if (percent >= 10) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading agents...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading agents: {error?.message || 'Unknown error'}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No agents found.{" "}
        <Link href="/agents/form" className="text-blue-500 hover:underline">
          Please add an agent first
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent: Agent) => (
        <div
          key={agent._id}
          className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Card Header */}
          <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
            <h3 className="font-medium text-gray-900 truncate">{agent.name}</h3>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => toggleMenu(agent._id)}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1 cursor-pointer"
                title="Agent actions"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>

              {activeMenu === agent._id && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <Link
                      href={`/agents/form?id=${agent._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(agent._id)}
                      disabled={deleteAgentMutation.isPending}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      {deleteAgentMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4">
            {/* Address */}
            <div className="flex items-start space-x-2 text-sm text-gray-500 mb-3">
              <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2" title={agent.address}>
                {agent.address}
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <PhoneIcon className="h-4 w-4 flex-shrink-0" />
              <span>{agent.mobile}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={agent.email}>{agent.email}</span>
            </div>

            {/* Commission and Balance */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-500">Commission</span>
                <div
                  className={`mt-1 inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${getCommissionStyle(
                    agent.commPercent
                  )}`}
                >
                  {agent.commPercent}%
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-500">Balance</span>
                <div
                  className={`mt-1 font-medium ${
                    agent.balance < 0 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  ₹{agent.balance?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Opening: ₹{agent.openingBalance}
                </div>
              </div>
            </div>
          </div>
        </div> 
      ))}
    </div>
  );
}