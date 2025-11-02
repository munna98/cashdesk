// components/reports/CommissionReport.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/outline";

interface CommissionData {
  _id: string;
  name: string;
  commPercent: number;
  totalCommission: number;
  receiptCount: number;
  transactions: Array<{
    _id: string;
    transactionNumber: string;
    date: string;
    type: string;
    amount: number;
    commissionAmount?: number;
    note: string;
  }>;
}

export default function CommissionReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [commissionData, setCommissionData] = useState<CommissionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);

    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get("/api/agents");
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const generateReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select date range");
      return;
    }

    setLoading(true);
    try {
      const params: any = { startDate, endDate };
      if (selectedAgent) params.agentId = selectedAgent;

      const response = await axios.get("/api/reports/commission-report", {
        params,
      });

      setCommissionData(response.data);
    } catch (error) {
      console.error("Error generating commission report:", error);
      alert("Error generating report");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalCommission = commissionData.reduce(
    (sum, agent) => sum + agent.totalCommission,
    0
  );

  const totalReceipts = commissionData.reduce(
    (sum, agent) => sum + agent.receiptCount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold text-gray-900">Commission Analysis Report</h2>
        <p className="text-sm text-gray-600 mt-1">
          Detailed commission breakdown by agent
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent (Optional)
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {commissionData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-1">Total Commission</p>
              <p className="text-3xl font-bold text-yellow-600">
                ₹{totalCommission.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Total Receipts</p>
              <p className="text-3xl font-bold text-blue-600">{totalReceipts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 mb-1">Agents</p>
              <p className="text-3xl font-bold text-purple-600">
                {commissionData.length}
              </p>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex gap-2 print:hidden">
            <button
              onClick={() => alert("Exporting to PDF...")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export PDF
            </button>
            <button
              onClick={() => alert("Exporting to Excel...")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export Excel
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <PrinterIcon className="h-5 w-5" />
              Print
            </button>
          </div>

          {/* Commission Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Agent-wise Commission Breakdown
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {commissionData.map((agent) => (
                <div key={agent._id}>
                  <div
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setExpandedAgent(expandedAgent === agent._id ? null : agent._id)
                    }
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                        <p className="text-sm text-gray-600">
                          Commission Rate: {agent.commPercent}% | Receipts:{" "}
                          {agent.receiptCount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-600">
                          ₹{agent.totalCommission.toLocaleString()}
                        </p>
                        <button className="text-blue-600 text-sm hover:underline">
                          {expandedAgent === agent._id ? "Hide Details" : "Show Details"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Transaction Details */}
                  {expandedAgent === agent._id && (
                    <div className="px-6 py-4 bg-gray-50">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                              Transaction #
                            </th>
                            <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                              Type
                            </th>
                            <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">
                              Receipt Amount
                            </th>
                            <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">
                              Commission
                            </th>
                            <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                              Note
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {agent.transactions.map((txn) => (
                            <tr key={txn._id} className="border-b hover:bg-gray-100">
                              <td className="py-2 text-sm">{formatDate(txn.date)}</td>
                              <td className="py-2 text-sm">{txn.transactionNumber}</td>
                              <td className="py-2 text-sm capitalize">{txn.type}</td>
                              <td className="py-2 text-sm text-right">
                                ₹{txn.amount.toLocaleString()}
                              </td>
                              <td className="py-2 text-sm text-right font-semibold text-yellow-600">
                                ₹
                                {(txn.commissionAmount || txn.amount).toLocaleString()}
                              </td>
                              <td className="py-2 text-sm text-gray-600">{txn.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}

              {/* Total Row */}
              <div className="px-6 py-4 bg-gray-100 font-bold">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-900">TOTAL COMMISSION</span>
                  </div>
                  <div className="text-2xl text-yellow-600">
                    ₹{totalCommission.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {commissionData.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">
            Select date range and click "Generate Report" to view commission analysis
          </p>
        </div>
      )}
    </div>
  );
}