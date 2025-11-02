// components/reports/DailySummaryReport.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  CalendarIcon, 
  ArrowDownTrayIcon,
  PrinterIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

interface DailySummaryData {
  summary: {
    totalOpeningBalance: number;
    totalReceived: number;
    totalCommission: number;
    totalPaid: number;
    totalCancelled: number;
    totalClosingBalance: number;
  };
  agents: Array<{
    _id: string;
    name: string;
    opening: number;
    received: number;
    commission: number;
    paid: number;
    cancelled: number;
    closing: number;
  }>;
}

export default function DailySummaryReport() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState<DailySummaryData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/dashboard?date=${selectedDate}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching daily summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: "prev" | "next" | "today") => {
    const currentDate = new Date(selectedDate);

    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1);
      setSelectedDate(currentDate.toISOString().split("T")[0]);
    } else if (direction === "next") {
      currentDate.setDate(currentDate.getDate() + 1);
      setSelectedDate(currentDate.toISOString().split("T")[0]);
    } else {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleExport = (format: "pdf" | "excel") => {
    // Implement export functionality
    alert(`Exporting to ${format.toUpperCase()}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header with Date Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Daily Summary Report</h2>
          <p className="text-sm text-gray-600 mt-1">
            {formatDisplayDate(selectedDate)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate("prev")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => navigateDate("next")}
            disabled={selectedDate === new Date().toISOString().split("T")[0]}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() => navigateDate("today")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Today
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <button
          onClick={() => handleExport("pdf")}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export PDF
        </button>
        <button
          onClick={() => handleExport("excel")}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export Excel
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <PrinterIcon className="h-5 w-5" />
          Print
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Opening", value: data.summary.totalOpeningBalance, color: "purple" },
          { label: "Received", value: data.summary.totalReceived, color: "green" },
          { label: "Commission", value: data.summary.totalCommission, color: "yellow" },
          { label: "Paid", value: data.summary.totalPaid, color: "red" },
          { label: "Cancelled", value: data.summary.totalCancelled, color: "orange" },
          { label: "Closing", value: data.summary.totalClosingBalance, color: "blue" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Agent-wise Details Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Agent-wise Details</h3>
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
                  Received
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Commission
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Paid
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Cancelled
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Closing
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.agents.map((agent) => (
                <tr key={agent._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {agent.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                    ₹{agent.opening.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-semibold">
                    ₹{agent.received.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-yellow-600 font-semibold">
                    ₹{agent.commission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-red-600 font-semibold">
                    ₹{agent.paid.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-orange-600 font-semibold">
                    ₹{agent.cancelled.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-blue-600 font-bold">
                    ₹{agent.closing.toLocaleString()}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-gray-100 font-bold">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">TOTAL</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                  ₹{data.summary.totalOpeningBalance.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-green-600">
                  ₹{data.summary.totalReceived.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-yellow-600">
                  ₹{data.summary.totalCommission.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-red-600">
                  ₹{data.summary.totalPaid.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-orange-600">
                  ₹{data.summary.totalCancelled.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-blue-600">
                  ₹{data.summary.totalClosingBalance.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Footer */}
      <div className="text-center text-sm text-gray-500 print:block hidden">
        <p>Generated on {new Date().toLocaleString("en-IN")}</p>
        <p>Cash Desk App - Daily Summary Report</p>
      </div>
    </div>
  );
}