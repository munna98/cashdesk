// pages/dashboard.tsx

import Layout from "@/components/layout/Layout";
import SummaryCards from "@/components/dashboard/SummaryCards";
import AgentCard from "@/components/dashboard/AgentCard";
import ReceiveCashModal from "@/components/dashboard/ReceiveCashModal";
import { useState, useEffect } from "react";
import axios from "axios";
import MakePaymentModal from "@/components/dashboard/MakePaymentModal";

interface Agent {
  _id: string;
  name: string;
}

interface Account {
  _id: string;
  name: string;
  type: "agent" | "recipient" | "cash" | "income" | "employee" | "expense";
  linkedEntityId: string | null;
  balance: number;
}

interface Transaction {
  _id: string;
  fromAccount: { _id: string; name: string };
  toAccount: { _id: string; name: string };
  effectedAccount?: { _id: string; name: string };
  amount: number;
  date: string;
  type: "receipt" | "payment";
  commissionAmount?: number;
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

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [todayReceipts, setTodayReceipts] = useState<Transaction[]>([]);
  const [todayPayments, setTodayPayments] = useState<Transaction[]>([]);
  const [receiptSuccess, setReceiptSuccess] = useState<SavedReceiptInfo | null>(
    null
  );
  const [paymentSuccess, setPaymentSuccess] = useState<SavedPaymentInfo | null>(
    null
  );

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get("/api/agents")
      .then((res) => setAgents(res.data))
      .catch((err) => console.error("Failed to load agents", err));

    axios
      .get("/api/accounts")
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error("Failed to load accounts", err));

    axios
      .get(`/api/transactions?type=receipt&date=${today}`)
      .then((res) => setTodayReceipts(res.data))
      .catch((err) => console.error("Failed to load today's receipts", err));

    axios
      .get(`/api/transactions?type=payment&date=${today}`)
      .then((res) => setTodayPayments(res.data))
      .catch((err) => console.error("Failed to load today's payments", err));
  }, [today]);

  const getAgentAccount = (agentId: string) => {
    return accounts.find(
      (acc) => acc.type === "agent" && acc.linkedEntityId === agentId
    );
  };

  const getAgentData = (agentId: string) => {
    const account = getAgentAccount(agentId);
    const opening = account?.balance || 0;
    console.log(account, "account");
    const agentReceipts = todayReceipts.filter(
      (r) => r.fromAccount?._id === account?._id
    );
    
    // Updated logic: Use effectedAccount to identify which agent had cash deducted
    const agentPayments = todayPayments.filter(
      (p) => p.effectedAccount?._id === account?._id
      
    );
    

    console.log(todayPayments, "todayPayments");
    console.log(todayReceipts, "todayReceipts");
    console.log(agentPayments, "agentpayments");


    const received = agentReceipts.reduce((sum, r) => sum + r.amount, 0);
    const commission = agentReceipts.reduce(
      (sum, r) => sum + (r.commissionAmount || 0),
      0
    );
    const paid = agentPayments.reduce((sum, p) => sum + p.amount, 0);
    console.log(paid, "paid");
    console.log(commission, "commission");
    console.log(received, "received");

    return { opening, received, commission, paid };
  };

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAgentName, setSelectedAgentName] = useState<string | null>(
    null
  );

  

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

    axios
      .get(`/api/transactions?type=receipt&date=${today}`)
      .then((res) => setTodayReceipts(res.data))
      .catch((err) => console.error("Failed to reload receipts"));

    axios
      .get("/api/accounts")
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error("Failed to reload accounts"));
  };

  const handleCashPayed = async (paymentInfo: SavedPaymentInfo) => {
    setPaymentSuccess(paymentInfo);
    setIsPaymentModalOpen(false);

    axios
      .get(`/api/transactions?type=payment&date=${today}`)
      .then((res) => setTodayPayments(res.data))
      .catch((err) => console.error("Failed to reload payments"));

    axios
      .get("/api/accounts")
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error("Failed to reload accounts"));
  };

  const totalReceived = todayReceipts.reduce((sum, r) => sum + r.amount, 0);
  const totalCommission = todayReceipts.reduce(
    (sum, r) => sum + (r.commissionAmount || 0),
    0
  );
  const totalPaid = todayPayments.reduce((sum, p) => sum + p.amount, 0);

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
                  (Commission: ₹{receiptSuccess.commissionAmount.toFixed(
                    2
                  )}){" "}
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
          {agents.map((agent) => {
            const { opening, received, commission, paid } = getAgentData(
              agent._id
            );

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