// pages/dashboard.tsx - Updated with date selection
import Layout from "@/components/layout/Layout";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AgentCard from "@/components/dashboard/AgentCard";
import ReceiveCashModal from "@/components/dashboard/ReceiveCashModal";
import MakePaymentModal from "@/components/dashboard/MakePaymentModal";
import CancelModal from "@/components/dashboard/CancelModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface AgentData {
  _id: string;
  name: string;
  opening: number;
  received: number;
  commission: number;
  paid: number;
  cancelled: number;
  closing: number;
}

interface DashboardSummary {
  totalOpeningBalance: number;
  totalReceived: number;
  totalCommission: number;
  totalPaid: number;
  totalCancelled: number;
  totalClosingBalance: number;
}

interface SavedReceiptInfo {
  transactionNumber: string;
  amount: number;
  commissionAmount?: number;
}

interface SavedPaymentInfo {
  transactionNumber: string;
  amount: number;
}

interface SavedCancelInfo {
  transactionNumber: string;
  amount: number;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalOpeningBalance: 0,
    totalReceived: 0,
    totalCommission: 0,
    totalPaid: 0,
    totalCancelled: 0,
    totalClosingBalance: 0
  });
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [receiptSuccess, setReceiptSuccess] = useState<SavedReceiptInfo | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<SavedPaymentInfo | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<SavedCancelInfo | null>(null);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAgentName, setSelectedAgentName] = useState<string | null>(null);

  const fetchDashboardData = async (date: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/dashboard?date=${date}`);
      
      setSummary(data.summary);
      setAgents(data.agents);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    // Clear success messages when changing dates
    setReceiptSuccess(null);
    setPaymentSuccess(null);
    setCancelSuccess(null);
  };

  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    const currentDate = new Date(selectedDate);
    
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
      setSelectedDate(currentDate.toISOString().split("T")[0]);
    } else if (direction === 'next') {
      currentDate.setDate(currentDate.getDate() + 1);
      setSelectedDate(currentDate.toISOString().split("T")[0]);
    } else {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
    
    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";
    
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleReceiveCashClick = (agentId: string, agentName: string) => {
    setSelectedAgentId(agentId);
    setSelectedAgentName(agentName);
    setIsReceiveModalOpen(true);
    setReceiptSuccess(null);
  };

  const handleMakePaymentClick = (agentId: string, agentName: string) => {
    setSelectedAgentId(agentId);
    setSelectedAgentName(agentName);
    setIsPaymentModalOpen(true);
    setPaymentSuccess(null);
  };

  const handleCancelClick = (agentId: string, agentName: string) => {
    setSelectedAgentId(agentId);
    setSelectedAgentName(agentName);
    setIsCancelModalOpen(true);
    setCancelSuccess(null);
  };

  const handleCloseReceiveModal = () => {
    setIsReceiveModalOpen(false);
    setSelectedAgentId(null);
    setSelectedAgentName(null);
    setReceiptSuccess(null);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedAgentId(null);
    setSelectedAgentName(null);
    setPaymentSuccess(null);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedAgentId(null);
    setSelectedAgentName(null);
    setCancelSuccess(null);
  };

  const handleCashReceived = async (receiptInfo: SavedReceiptInfo) => {
    setReceiptSuccess(receiptInfo);
    setIsReceiveModalOpen(false);
    await fetchDashboardData(selectedDate);
  };

  const handleCashPayed = async (paymentInfo: SavedPaymentInfo) => {
    setPaymentSuccess(paymentInfo);
    setIsPaymentModalOpen(false);
    await fetchDashboardData(selectedDate);
  };

  const handleCancelSaved = async (cancelInfo: SavedCancelInfo) => {
    setCancelSuccess(cancelInfo);
    setIsCancelModalOpen(false);
    await fetchDashboardData(selectedDate);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-600">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Date Selector Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Dashboard - {formatDisplayDate(selectedDate)}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Previous Day Button */}
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Previous day"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Date Picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            
            {/* Next Day Button */}
            <button
              onClick={() => navigateDate('next')}
              disabled={selectedDate === new Date().toISOString().split("T")[0]}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next day"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Today Button */}
            <button
              onClick={() => navigateDate('today')}
              disabled={selectedDate === new Date().toISOString().split("T")[0]}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Today
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards
          openingBalance={summary.totalOpeningBalance}
          totalReceived={summary.totalReceived}
          totalCommission={summary.totalCommission}
          totalPaid={summary.totalPaid}
          totalCancelled={summary.totalCancelled}
        />

        {/* Success Messages */}
        {receiptSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <p className="font-medium">Receipt recorded successfully!</p>
            <p className="text-sm">
              Transaction #{receiptSuccess.transactionNumber} for ₹
              {receiptSuccess.amount.toFixed(2)} has been received.
              {receiptSuccess.commissionAmount !== undefined && (
                <>
                  {" "}
                  (Commission: ₹{receiptSuccess.commissionAmount.toFixed(2)}){" "}
                </>
              )}
            </p>
          </div>
        )}

        {paymentSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <p className="font-medium">Payment recorded successfully!</p>
            <p className="text-sm">
              Transaction #{paymentSuccess.transactionNumber} for ₹
              {paymentSuccess.amount.toFixed(2)} has been recorded.
            </p>
          </div>
        )}

        {cancelSuccess && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800">
            <p className="font-medium">Cancellation recorded successfully!</p>
            <p className="text-sm">
              Transaction #{cancelSuccess.transactionNumber} for ₹
              {cancelSuccess.amount.toFixed(2)} has been cancelled.
            </p>
          </div>
        )}

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent._id}
              id={agent._id}
              name={agent.name}
              opening={agent.opening}
              received={agent.received}
              paid={agent.paid}
              commission={agent.commission}
              cancelled={agent.cancelled}
              onReceiveCash={handleReceiveCashClick}
              onMakePayment={handleMakePaymentClick}
              onCancel={handleCancelClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {agents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No agent data available for this date.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReceiveCashModal
        isOpen={isReceiveModalOpen}
        onClose={handleCloseReceiveModal}
        agentId={selectedAgentId}
        agentName={selectedAgentName}
        onCashReceived={handleCashReceived}
      />

      <MakePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        agentId={selectedAgentId}
        agentName={selectedAgentName}
        onPaymentMade={handleCashPayed}
      />

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        agentId={selectedAgentId}
        agentName={selectedAgentName}
        onCancelSaved={handleCancelSaved}
      />
    </Layout>
  );
}