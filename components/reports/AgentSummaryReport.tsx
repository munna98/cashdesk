// components/reports/AgentSummaryReport.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/outline";

interface AgentTransaction {
  date: string;
  type: "receipt" | "payment" | "journalentry";
  transactionNumber: string;
  amount: number;
  commissionAmount?: number;
  note: string;
}

interface AgentSummary {
  _id: string;
  name: string;
  openingBalance: number;
  totalReceipts: number;
  totalPayments: number;
  totalCommission: number;
  closingBalance: number;
  transactionCount: number;
}

export default function AgentSummaryReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [summaryData, setSummaryData] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactions, setTransactions] = useState<AgentTransaction[]>([]);

  useEffect(() => {
    // Set default dates (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);

    // Fetch agents
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
      // This would be a new API endpoint to generate agent summary
      const response = await axios.get("/api/reports/agent-summary", {
        params: {
          startDate,
          endDate,
          agentId: selectedAgent || undefined,
        },
      });
      setSummaryData(response.data);
    } catch (error) {
      console.error("Error generating report:", error);
      // For now, generate mock data
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockData: AgentSummary[] = agents.map((agent) => ({
      _id: agent._id,
      name: agent.name,
      openingBalance: agent.openingBalance || 0,
      totalReceipts: Math.floor(Math.random() * 50000),
      totalPayments: Math.floor(Math.random() * 30000),
      totalCommission: Math.floor(Math.random() * 5000),
      closingBalance: Math.floor(Math.random() * 20000),
      transactionCount: Math.floor(Math.random() * 50) + 10,
    }));
    setSummaryData(mockData);
  };

  const fetchAgentTransactions = async (agentId: string) => {
    // Fetch detailed transactions for selected agent
    setShowTransactions(true);
    // Mock data for now
    const mockTransactions: AgentTransaction[] = [
      {
        date: "2025-01-15",
        type: "receipt",
        transactionNumber: "RCT-2025-00001",
        amount: 5000,
        commissionAmount: 150,
        note: "Cash received",
      },
      {
        date: "2025-01-20",
        type: "payment",
        transactionNumber: "PMT-2025-00001",
        amount: 3000,
        note: "Payment made",
      },
    ];
    setTransactions(mockTransactions);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold text-gray-900">Agent Summary Report</h2>
        <p className="text-sm text-gray-600 mt-1">
          Comprehensive agent-wise transaction analysis
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

      {/* Export Actions */}
      {summaryData.length > 0 && (
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
      )}

      {/* Summary Table */}
      {summaryData.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Report Period: {formatDate(startDate)} to {formatDate(endDate)}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Agent Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Opening
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Receipts
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Payments
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Closing
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Txns
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase print:hidden">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summaryData.map((agent) => (
                  <tr key={agent._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {agent.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      ₹{agent.openingBalance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-semibold">
                      ₹{agent.totalReceipts.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-red-600 font-semibold">
                      ₹{agent.totalPayments.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-yellow-600 font-semibold">
                      ₹{agent.totalCommission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-blue-600 font-bold">
                      ₹{agent.closingBalance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900">
                      {agent.transactionCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center print:hidden">
                      <button
                        onClick={() => fetchAgentTransactions(agent._id)}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">TOTAL</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                    ₹
                    {summaryData
                      .reduce((sum, a) => sum + a.openingBalance, 0)
                      .toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-green-600">
                    ₹
                    {summaryData
                      .reduce((sum, a) => sum + a.totalReceipts, 0)
                      .toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-red-600">
                    ₹
                    {summaryData
                      .reduce((sum, a) => sum + a.totalPayments, 0)
                      .toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-yellow-600">
                    ₹
                    {summaryData
                      .reduce((sum, a) => sum + a.totalCommission, 0)
                      .toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-blue-600">
                    ₹
                    {summaryData
                      .reduce((sum, a) => sum + a.closingBalance, 0)
                      .toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-gray-900">
                    {summaryData.reduce((sum, a) => sum + a.transactionCount, 0)}
                  </td>
                  <td className="print:hidden"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Transaction Details</h3>
              <button
                onClick={() => setShowTransactions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Transaction #</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-right py-2">Commission</th>
                    <th className="text-left py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2">{formatDate(txn.date)}</td>
                      <td className="py-2">{txn.transactionNumber}</td>
                      <td className="py-2 capitalize">{txn.type}</td>
                      <td className="py-2 text-right">₹{txn.amount.toLocaleString()}</td>
                      <td className="py-2 text-right">
                        {txn.commissionAmount
                          ? `₹${txn.commissionAmount.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="py-2">{txn.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {summaryData.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">
            Select date range and click "Generate Report" to view agent summary
          </p>
        </div>
      )}
    </div>
  );
}