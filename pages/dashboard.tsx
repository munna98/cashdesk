// pages/dashboard.tsx - Refactored with React Query
import Layout from "@/components/layout/Layout";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AgentCard from "@/components/dashboard/AgentCard";
import ReceiveCashModal from "@/components/dashboard/ReceiveCashModal";
import MakePaymentModal from "@/components/dashboard/MakePaymentModal";
import { useState } from "react";
import { useAgents } from "@/hooks/queries/useAgents";
import { useAccounts } from "@/hooks/queries/useAgents";
import { useTransactions } from "@/hooks/queries/useAgents";

interface SavedReceiptInfo {
  transactionNumber: string;
  amount: number;
  commissionAmount?: number;
}

interface SavedPaymentInfo {
  transactionNumber: string;
  amount: number;
}

export default function Dashboard() {
  const [receiptSuccess, setReceiptSuccess] = useState<SavedReceiptInfo | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<SavedPaymentInfo | null>(null);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAgentName, setSelectedAgentName] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // React Query hooks - automatic caching and refetching
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: todayReceipts = [] } = useTransactions("receipt", today);
  const { data: todayPayments = [] } = useTransactions("payment", today);

  const getAgentAccount = (agentId: string) => {
    return accounts.find(
      (acc: any) => acc.type === "agent" && acc.linkedEntityId === agentId
    );
  };

  const getAgentData = (agentId: string) => {
    const account = getAgentAccount(agentId);
    const opening = account?.balance || 0;

    const agentReceipts = todayReceipts.filter(
      (r: any) => r.fromAccount?._id === account?._id
    );

    const agentPayments = todayPayments.filter(
      (p: any) => p.effectedAccount?._id === account?._id
    );

    const received = agentReceipts.reduce((sum: number, r: any) => sum + r.amount, 0);
    const commission = agentReceipts.reduce(
      (sum: number, r: any) => sum + (r.commissionAmount || 0),
      0
    );
    const paid = agentPayments.reduce((sum: number, p: any) => sum + p.amount, 0);

    return { opening, received, commission, paid };
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

  const handleCashReceived = async (receiptInfo: SavedReceiptInfo) => {
    setReceiptSuccess(receiptInfo);
    setIsReceiveModalOpen(false);
    // React Query automatically refetches after mutations
  };

  const handleCashPayed = async (paymentInfo: SavedPaymentInfo) => {
    setPaymentSuccess(paymentInfo);
    setIsPaymentModalOpen(false);
    // React Query automatically refetches after mutations
  };

  const totalReceived = todayReceipts.reduce((sum: number, r: any) => sum + r.amount, 0);
  const totalCommission = todayReceipts.reduce(
    (sum: number, r: any) => sum + (r.commissionAmount || 0),
    0
  );
  const totalPaid = todayPayments.reduce((sum: number, p: any) => sum + p.amount, 0);

  if (agentsLoading || accountsLoading) {
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
          totalReceived={totalReceived}
          totalCommission={totalCommission}
          totalPaid={totalPaid}
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
              {paymentSuccess.amount.toFixed(2)} has been received.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent: any) => {
            const { opening, received, commission, paid } = getAgentData(agent._id);

            return (
              <AgentCard
                key={agent._id}
                id={agent._id}
                name={agent.name}
                opening={opening}
                received={received}
                paid={paid}
                commission={commission}
                onReceiveCash={handleReceiveCashClick}
                onMakePayment={handleMakePaymentClick}
              />
            );
          })}
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
    </Layout>
  );
}