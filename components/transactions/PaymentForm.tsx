// components/transactions/PaymentForm.tsx - Updated for journal entry
import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useAccounts, useCreateTransaction } from "@/hooks/queries/useAgents";

interface Account {
  _id: string;
  name: string;
  type: string;
  linkedEntityId: string;
}

interface SavedPaymentInfo {
  transactionNumber: string;
  amount: number;
}

interface PaymentFormProps {
  onPaymentSaved?: () => void;
}

export default function PaymentForm({ onPaymentSaved }: PaymentFormProps) {
  const [accountId, setAccountId] = useState("");
  const [effectedAccountId, setEffectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [savedPayment, setSavedPayment] = useState<SavedPaymentInfo | null>(null);
  const [selectedToAccountType, setSelectedToAccountType] = useState("");

  // React Query hooks
  const { data: allAccounts = [], isLoading: accountsLoading } = useAccounts();
  const createTransactionMutation = useCreateTransaction();

  // Find cash account
  const cashAccount = allAccounts.find((acc: Account) => acc.type === "cash");
  const cashAccountId = cashAccount?._id || "";

  // Filter accounts (exclude cash)
  const accounts = allAccounts.filter((acc: Account) => acc._id !== cashAccountId);
  
  // Get agent accounts for the "From Agent" dropdown
  const agents = allAccounts.filter((acc: Account) => acc.type === "agent");

  // Update selected account type when accountId changes
  useEffect(() => {
    const selected = accounts.find((acc: Account) => acc._id === accountId);
    setSelectedToAccountType(selected?.type || "");
    
    // Reset effected account when changing to non-recipient
    if (selected?.type !== "recipient") {
      setEffectedAccountId("");
    }
  }, [accountId, accounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedToAccountType === "recipient" && !effectedAccountId) {
      alert("Please select a From Agent.");
      return;
    }

    const payment = {
      fromAccount: cashAccountId,
      toAccount: accountId,
      effectedAccount: selectedToAccountType === "recipient" ? effectedAccountId : undefined,
      amount: Number(amount),
      date,
      note,
      type: "payment" as const,
    };

    try {
      const response = await createTransactionMutation.mutateAsync(payment);
      console.log("Payment saved:", response);

      setSavedPayment({
        transactionNumber: response.transactionNumber,
        amount: response.amount,
      });

      // Reset form
      setAccountId("");
      setEffectedAccountId("");
      setAmount("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      setSelectedToAccountType("");

      if (onPaymentSaved) onPaymentSaved();
    } catch (error: any) {
      console.error("Error saving payment:", error);
      alert(error.response?.data?.error || "Failed to save payment.");
    }
  };

  const isLoading = accountsLoading;
  const isSubmitting = createTransactionMutation.isPending;

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="text-center py-8 text-gray-600">Loading form...</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {savedPayment && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">Payment saved successfully!</p>
          <p className="text-sm">
            Transaction #{savedPayment.transactionNumber} for ₹
            {savedPayment.amount.toFixed(2)} has been recorded.
            {selectedToAccountType === "recipient" && (
              <span className="block mt-1">
                ✓ Agent clearing journal entry created
              </span>
            )}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
      >
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
          Enter New Payment
        </h2>

        {/* To Account */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            To Account
          </label>
          <div className="relative">
            <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">-- Select Account --</option>
              {accounts.map((acc: Account) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* From Agent (only if To Account is a recipient) */}
        {selectedToAccountType === "recipient" && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              From Agent <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <select
                value={effectedAccountId}
                onChange={(e) => setEffectedAccountId(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">-- Select Agent --</option>
                {agents.map((agent: Account) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This will create a journal entry to clear the agent's account
            </p>
          </div>
        )}

        {/* Amount */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Amount Paid
          </label>
          <div className="relative">
            <BanknotesIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Enter amount"
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
              onChange={(e) => setDate(e.target.value)}
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
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
              disabled={isSubmitting}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}