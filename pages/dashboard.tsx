// pages/dashboard.tsx - Fixed with correct balance calculations
import Layout from "@/components/layout/Layout";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AgentCard from "@/components/dashboard/AgentCard";
import ReceiveCashModal from "@/components/dashboard/ReceiveCashModal";
import MakePaymentModal from "@/components/dashboard/MakePaymentModal";
import { useState } from "react";
import { useAgents, useAccounts, useAllTransactions, useTodayTransactions } from "@/hooks/queries/useAgents";

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
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  // React Query hooks
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  
  // Get ALL transactions (including journal entries) for opening balance calculation
  const { data: allTransactions = [] } = useAllTransactions();
  
  // Get today's transactions (all types including journal entries)
  const { data: todayTransactions = [] } = useTodayTransactions();

  // Filter today's transactions by type
  const todayReceipts = todayTransactions.filter((t: any) => t.type === "receipt");
  const todayPayments = todayTransactions.filter(
    (t: any) => t.type === "payment" && t.debitAccount?.type === "recipient"
  );
  const todayCommissions = todayTransactions.filter(
    (t: any) => 
      t.type === "journalentry" && 
      t.creditAccount?.type === "income" &&
      t.creditAccount?.name === "Commission"
  );

  const getAgentAccount = (agentId: string) => {
    return accounts.find(
      (acc: any) => acc.type === "agent" && acc.linkedEntityId === agentId
    );
  };

  // Calculate opening balance (balance before today)
  const calculateOpeningBalance = (agentAccountId: string, account: any) => {
    if (!agentAccountId) return 0;

    // Get transactions BEFORE today
    const priorTransactions = allTransactions.filter((t: any) => {
      const txnDate = new Date(t.date);
      return txnDate < startOfDay;
    });

    // Start with the account's opening balance (negative for agent accounts)
    let balance = account?.openingBalance || 0;

    // Process all prior transactions
    priorTransactions.forEach((txn: any) => {
      const isDebited = txn.debitAccount?._id === agentAccountId;
      const isCredited = txn.creditAccount?._id === agentAccountId;

      if (isDebited) {
        // Agent is debited (reduces their credit balance, i.e., they owe us less)
        balance += txn.amount;
      } else if (isCredited) {
        // Agent is credited (increases their credit balance, i.e., they owe us more)
        balance -= txn.amount;
      }
    });

    return balance;
  };

  const getAgentData = (agentId: string) => {
    const account = getAgentAccount(agentId);
    const agentAccountId = account?._id;

    // Calculate opening balance (before today's transactions)
    const opening = calculateOpeningBalance(agentAccountId, account);

    // Today's receipts from this agent: Dr Cash | Cr Agent
    const agentReceipts = todayReceipts.filter(
      (r: any) => r.creditAccount?._id === agentAccountId
    );

    // Today's commission journal entries for this agent: Dr Agent | Cr Commission
    const agentCommissions = todayCommissions.filter(
      (c: any) => c.debitAccount?._id === agentAccountId
    );

    // Today's payments (clearing journals): Dr Agent | Cr Recipient
    const agentPayments = todayTransactions.filter(
      (p: any) => 
        p.type === "journalentry" &&
        p.debitAccount?._id === agentAccountId &&
        p.creditAccount?.type === "recipient"
    );

    const received = agentReceipts.reduce((sum: number, r: any) => sum + r.amount, 0);
    const commission = agentCommissions.reduce((sum: number, c: any) => sum + c.amount, 0);
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
  };

  const handleCashPayed = async (paymentInfo: SavedPaymentInfo) => {
    setPaymentSuccess(paymentInfo);
    setIsPaymentModalOpen(false);
  };

  // Calculate summary totals
  const totalReceived = todayReceipts.reduce((sum: number, r: any) => sum + r.amount, 0);
  const totalCommission = todayCommissions.reduce((sum: number, c: any) => sum + c.amount, 0);
  const totalPaid = todayPayments.reduce((sum: number, p: any) => sum + p.amount, 0);

  // Calculate opening balance for cash account (before today)
  const cashAccount = accounts.find((acc: any) => acc.type === "cash");
  const cashOpeningBalance = cashAccount 
    ? calculateOpeningBalance(cashAccount._id, cashAccount)
    : 0;

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
          openingBalance={cashOpeningBalance}
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