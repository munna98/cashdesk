// components/reports/TransactionRegisterReport.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDownTrayIcon, PrinterIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface Transaction {
  _id: string;
  transactionNumber: string;
  type: "receipt" | "payment" | "journalentry";
  date: string;
  debitAccount: { name: string; type: string };
  creditAccount: { name: string; type: string };
  amount: number;
  commissionAmount?: number;
  note: string;
}

export default function TransactionRegisterReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalReceipts: 0,
    totalPayments: 0,
    totalJournals: 0,
    totalCommission: 0,
    grandTotal: 0,
  });

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select date range");
      return;
    }

    setLoading(true);
    try {
      const params: any = {
        startDate,
        endDate,
      };
      if (transactionType) params.type = transactionType;

      const response = await axios.get("/api/reports/transaction-register", {
        params,
      });

      setTransactions(response.data.transactions);
      calculateSummary(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("Error generating report");
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (txns: Transaction[]) => {
    const summary = {
      totalReceipts: 0,
      totalPayments: 0,
      totalJournals: 0,
      totalCommission: 0,
      grandTotal: 0,
    };

    txns.forEach((txn) => {
      if (txn.type === "receipt") {
        summary.totalReceipts += txn.amount;
        summary.totalCommission += txn.commissionAmount || 0;
      } else if (txn.type === "payment") {
        summary.totalPayments += txn.amount;
      } else if (txn.type === "journalentry") {
        summary.totalJournals += txn.amount;
      }
      summary.grandTotal += txn.amount;
    });

    setSummary(summary);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "receipt":
        return "bg-green-100 text-green-800";
      case "payment":
        return "bg-red-100 text-red-800";
      case "journalentry":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold text-gray-900">Transaction Register</h2>
        <p className="text-sm text-gray-600 mt-1">
          Complete transaction history with detailed filters
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
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
              Transaction Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="receipt">Receipts</option>
              <option value="payment">Payments</option>
              <option value="journalentry">Journal Entries</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {transactions.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Total Receipts</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{summary.totalReceipts.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <p className="text-sm text-gray-600 mb-1">Total Payments</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{summary.totalPayments.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Journal Entries</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{summary.totalJournals.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 mb-1">Commission</p>
              <p className="text-2xl font-bold text-yellow-600">
                ₹{summary.totalCommission.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 mb-1">Grand Total</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{summary.grandTotal.toLocaleString()}
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

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Transactions ({transactions.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Transaction #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Debit Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Credit Account
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((txn) => (
                    <tr key={txn._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(txn.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {txn.transactionNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                            txn.type
                          )}`}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {txn.debitAccount.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {txn.creditAccount.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                        ₹{txn.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-yellow-600">
                        {txn.commissionAmount
                          ? `₹${txn.commissionAmount.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {txn.note || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {transactions.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">
            Select filters and click "Generate Report" to view transactions
          </p>
        </div>
      )}
    </div>
  );
}