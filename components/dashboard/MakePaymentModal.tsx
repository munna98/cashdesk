// Updated with debit/credit terminology

import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  UserCircleIcon,
  CalendarIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useAgent, useAccounts, useCreateTransaction } from "@/hooks/queries/useAgents";

interface Account {
  _id: string;
  name: string;
  type: string;
  linkedEntityType: string;
  linkedEntityId: string;
}

interface AgentWithAccount {
  _id: string;
  name: string;
  account?: Account;
}

interface MakePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string | null;
  agentName: string | null;
  onPaymentMade: (paymentInfo: SavedPaymentInfo) => void;
}

interface SavedPaymentInfo {
  transactionNumber: string;
  amount: number;
}

const MakePaymentModal = ({
  isOpen,
  onClose,
  agentId,
  agentName,
  onPaymentMade,
}: MakePaymentModalProps) => {
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [toAccountId, setToAccountId] = useState("");

  const { data: agent, isLoading: agentLoading } = useAgent(agentId || "");
  const { data: allAccounts = [], isLoading: accountsLoading } = useAccounts();
  const createTransactionMutation = useCreateTransaction();

  const agentAccount = allAccounts.find(
    (acc: Account) => acc.linkedEntityType === "agent" && acc.linkedEntityId === agentId
  );
  
  const cashAccount = allAccounts.find((acc: Account) => acc.type === "cash");
  const recipientAccounts = allAccounts.filter((acc: Account) => acc.type === "recipient");

  const agentWithAccount: AgentWithAccount | null = agent ? {
    ...agent,
    account: agentAccount
  } : null;

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, agentId]);

  const resetForm = () => {
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setNote("");
    setToAccountId("");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === "" ? "" : Number(value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const handleToAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToAccountId(e.target.value);
  };

  const handleSave = async () => {
    if (!agentId) {
      alert("Agent information is missing.");
      return;
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    
    if (!toAccountId) {
      alert("Please select a recipient account.");
      return;
    }
    
    if (!agentWithAccount?.account) {
      alert(`Error: No account found for agent ${agentName}.`);
      return;
    }
    
    if (!cashAccount) {
      alert("Error: Cash account not found.");
      return;
    }

    try {
      // UPDATED: Using debit/credit terminology
      // Payment: Dr Recipient | Cr Cash
      const paymentData = {
        debitAccount: toAccountId,      // Recipient (Dr)
        creditAccount: cashAccount._id, // Cash (Cr)
        effectedAccount: agentWithAccount.account._id, // For clearing journal
        amount: amount,
        date: date,
        note: note,
        type: "payment" as const,
      };

      const response = await createTransactionMutation.mutateAsync(paymentData);
      console.log("Payment created:", response);

      const savedInfo: SavedPaymentInfo = {
        transactionNumber: response.transactionNumber,
        amount: response.amount,
      };

      onPaymentMade(savedInfo);
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creating payment:", error);
      alert(`Failed to make payment: ${error.response?.data?.error || error.message}`);
    }
  };

  if (!isOpen) {
    return null;
  }

  const isLoading = agentLoading || accountsLoading;
  const isSubmitting = createTransactionMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
          Make New Payment
        </h2>

        {!agentWithAccount?.account && agentId && !isLoading && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            <p className="text-sm">Warning: No account found for this agent. Please set up an account first.</p>
          </div>
        )}

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              From Agent
            </label>
            <div className="relative">
              <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <input
                type="text"
                value={agentName || ""}
                readOnly
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              To Account (Recipient)
            </label>
            <div className="relative">
              <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <select
                value={toAccountId}
                onChange={handleToAccountChange}
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">-- Select Recipient Account --</option>
                {recipientAccounts.map((acc: Account) => ( 
                  <option key={acc._id} value={acc._id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Amount to Pay
            </label>
            <div className="relative">
              <BanknotesIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="relative">
              <CalendarIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Note
            </label>
            <div className="relative">
              <PencilSquareIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <input
                type="text"
                value={note}
                onChange={handleNoteChange}
                placeholder="Optional note"
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting || !cashAccount || !toAccountId || isLoading}
              className={`w-auto ${
                !cashAccount || isSubmitting || !toAccountId || isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              } text-white font-medium py-2 px-4 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {isSubmitting ? "Processing..." : "Make Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakePaymentModal;