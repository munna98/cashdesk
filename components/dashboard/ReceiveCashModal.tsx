// components/dashboard/ReceiveCashModal.tsx - Refactored with React Query
import { useState, useEffect, useRef } from "react";
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
  commPercent?: number;
  account?: Account;
}

interface ReceiveCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string | null;
  agentName: string | null;
  onCashReceived: (receiptInfo: SavedReceiptInfo) => void;
}

interface SavedReceiptInfo {
  transactionNumber: string;
  amount: number;
  commissionAmount?: number;
}

const ReceiveCashModal = ({
  isOpen,
  onClose,
  agentId,
  agentName,
  onCashReceived,
}: ReceiveCashModalProps) => {
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [commissionAmount, setCommissionAmount] = useState<number | undefined>(undefined);
  
  const isCommissionAmountFocused = useRef(false);

  // React Query hooks
  const { data: agent, isLoading: agentLoading } = useAgent(agentId || "");
  const { data: allAccounts = [], isLoading: accountsLoading } = useAccounts();
  const createTransactionMutation = useCreateTransaction();

  // Find the agent's account and cash account
  const agentAccount = allAccounts.find(
    (acc: Account) => acc.linkedEntityType === "agent" && acc.linkedEntityId === agentId
  );
  
  const cashAccount = allAccounts.find((acc: Account) => acc.type === "cash");

  const agentWithAccount: AgentWithAccount | null = agent ? {
    ...agent,
    account: agentAccount
  } : null;

  // Calculate commission automatically
  useEffect(() => {
    if (agentWithAccount?.commPercent && typeof amount === 'number') {
      if (!isCommissionAmountFocused.current) {
        setCommissionAmount(amount * (agentWithAccount.commPercent / 100));
      }
    } else {
      if (!isCommissionAmountFocused.current) {
        setCommissionAmount(undefined);
      }
    }
  }, [amount, agentWithAccount]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, agentId]);

  const resetForm = () => {
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setNote("");
    setCommissionAmount(undefined);
    isCommissionAmountFocused.current = false;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === "" ? "" : Number(value));
  };

  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommissionAmount(value === "" ? undefined : Number(value));
  };
  
  const handleCommissionFocus = () => {
    isCommissionAmountFocused.current = true;
  };
  
  const handleCommissionBlur = () => {
    isCommissionAmountFocused.current = false;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const handleSave = async () => {
    // Validation checks
    if (!agentId) {
      alert("Agent information is missing.");
      return;
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      alert("Please enter a valid amount.");
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
      const receiptData = {
        fromAccount: agentWithAccount.account._id,
        toAccount: cashAccount._id,
        amount: amount,
        date: date,
        note: note,
        type: "receipt" as const,
        commissionAmount: commissionAmount || 0,
      };

      const response = await createTransactionMutation.mutateAsync(receiptData);
      console.log("Cash receipt created:", response);

      const savedInfo: SavedReceiptInfo = {
        transactionNumber: response.transactionNumber,
        amount: response.amount,
        commissionAmount: response.commissionAmount,
      };

      onCashReceived(savedInfo);
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creating receipt:", error);
      alert(`Failed to receive cash: ${error.response?.data?.error || error.message}`);
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
          Enter New Receipt
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
          {/* Agent Account (Read-only Input) */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Agent Account
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

          {/* Amount */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Amount Received
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

          {/* Commission Amount */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Commission Amount
            </label>
            <div className="relative">
              <BanknotesIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <input
                type="number"
                value={commissionAmount !== undefined ? commissionAmount.toFixed(2) : ""}
                onChange={handleCommissionChange}
                onFocus={handleCommissionFocus}
                onBlur={handleCommissionBlur}
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Enter commission amount"
              />
            </div>
          </div>

          {/* Date */}
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

          {/* Note */}
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
              disabled={isSubmitting || !cashAccount || isLoading}
              className={`w-auto ${
                !cashAccount || isSubmitting || isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              } text-white font-medium py-2 px-4 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {isSubmitting ? "Saving..." : "Save Receipt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiveCashModal;