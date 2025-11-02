// pages/dashboard.tsx - Updated with cancellation support
import Layout from "@/components/layout/Layout";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AgentCard from "@/components/dashboard/AgentCard";
import ReceiveCashModal from "@/components/dashboard/ReceiveCashModal";
import MakePaymentModal from "@/components/dashboard/MakePaymentModal";
import CancelModal from "@/components/dashboard/CancelModal";
import { useState, useEffect } from "react";
import axios from "axios";

interface AgentData {
  _id: string;
  name: string;
  opening: number;
  received: number;
  commission: number;
  paid: number;
  cancelled: number; // NEW
  closing: number;
}

interface DashboardSummary {
  totalOpeningBalance: number;
  totalReceived: number;
  totalCommission: number;
  totalPaid: number;
  totalCancelled: number; // NEW
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
  const [summary, setSummary] = useState<DashboardSummary>({
    totalOpeningBalance: 0,
    totalReceived: 0,
    totalCommission: 0,
    totalPaid: 0,
    totalCancelled: 0, // NEW
    totalClosingBalance: 0
  });
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [receiptSuccess, setReceiptSuccess] = useState<SavedReceiptInfo | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<SavedPaymentInfo | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<SavedCancelInfo | null>(null); // NEW
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // NEW
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAgentName, setSelectedAgentName] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const { data } = await axios.get(`/api/dashboard?date=${today}`);
      
      setSummary(data.summary);
      setAgents(data.agents);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  // NEW: Handle cancel click
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

  // NEW: Handle close cancel modal
  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedAgentId(null);
    setSelectedAgentName(null);
    setCancelSuccess(null);
  };

  const handleCashReceived = async (receiptInfo: SavedReceiptInfo) => {
    setReceiptSuccess(receiptInfo);
    setIsReceiveModalOpen(false);
    await fetchDashboardData();
  };

  const handleCashPayed = async (paymentInfo: SavedPaymentInfo) => {
    setPaymentSuccess(paymentInfo);
    setIsPaymentModalOpen(false);
    await fetchDashboardData();
  };

  // NEW: Handle cancellation saved
  const handleCancelSaved = async (cancelInfo: SavedCancelInfo) => {
    setCancelSuccess(cancelInfo);
    setIsCancelModalOpen(false);
    await fetchDashboardData();
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
        <SummaryCards
          openingBalance={summary.totalOpeningBalance}
          totalReceived={summary.totalReceived}
          totalCommission={summary.totalCommission}
          totalPaid={summary.totalPaid}
          totalCancelled={summary.totalCancelled}
        />

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

        {/* NEW: Cancel success message */}
        {cancelSuccess && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800">
            <p className="font-medium">Cancellation recorded successfully!</p>
            <p className="text-sm">
              Transaction #{cancelSuccess.transactionNumber} for ₹
              {cancelSuccess.amount.toFixed(2)} has been cancelled.
            </p>
          </div>
        )}

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
      </div>

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

      {/* NEW: Cancel Modal */}
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