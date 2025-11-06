// components/transactions/JournalEntryForm.tsx - Updated with debit/credit
import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAccounts, useCreateTransaction } from "@/hooks/queries/useAgents";

interface Account {
  _id: string;
  name: string;
  type: string;
  linkedEntityType: string;
  linkedEntityId: string;
}

interface SavedJournalInfo {
  transactionNumber: string;
  amount: number;
}

interface JournalEntryFormProps {
  onJournalSaved?: (journalInfo: SavedJournalInfo) => void;
}

export default function JournalEntryForm({ onJournalSaved }: JournalEntryFormProps) {
  const [debitAccountId, setDebitAccountId] = useState("");
  const [creditAccountId, setCreditAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [savedJournal, setSavedJournal] = useState<SavedJournalInfo | null>(null);

  // React Query hooks
  const { data: allAccounts = [], isLoading: accountsLoading } = useAccounts();
  const createTransactionMutation = useCreateTransaction();

  // Get all accounts except cash (optional - you can include cash if needed)
  const availableAccounts = allAccounts.filter(
    (acc: Account) => acc.type !== "cash" // Exclude cash, or remove this filter to include all
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!debitAccountId || !creditAccountId) {
      alert("Please select both debit and credit accounts.");
      return;
    }

    if (debitAccountId === creditAccountId) {
      alert("Debit and Credit accounts cannot be the same.");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      // UPDATED: Using debit/credit terminology
      const journalData = {
        debitAccount: debitAccountId,   // Account to debit
        creditAccount: creditAccountId, // Account to credit
        amount: Number(amount),
        date,
        note,
        type: "journalentry" as const,
      };

      const response = await createTransactionMutation.mutateAsync(journalData);
      console.log("Journal entry created:", response);

      const savedInfo: SavedJournalInfo = {
        transactionNumber: response.transactionNumber,
        amount: response.amount,
      };
      setSavedJournal(savedInfo);

      // Reset form
      setDebitAccountId("");
      setCreditAccountId("");
      setAmount("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);

      if (onJournalSaved) onJournalSaved(savedInfo);
    } catch (error: any) {
      console.error("Error creating journal entry:", error);
      alert(error.response?.data?.error || "Failed to create journal entry.");
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
      {savedJournal && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">Journal entry saved successfully!</p>
          <p className="text-sm">
            Transaction #{savedJournal.transactionNumber} for ₹
            {savedJournal.amount.toFixed(2)} has been recorded.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
      >
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
          Create Journal Entry
        </h2>

        {/* Debit Account */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Debit Account
          </label>
          <div className="relative">
            <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
            <select
              value={debitAccountId}
              onChange={(e) => setDebitAccountId(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">-- Select Debit Account --</option>
              {availableAccounts.map((acc: Account) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Credit Account */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Credit Account
          </label>
          <div className="relative">
            <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
            <select
              value={creditAccountId}
              onChange={(e) => setCreditAccountId(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">-- Select Credit Account --</option>
              {availableAccounts.map((acc: Account) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Amount
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
              min="0"
              step="0.01"
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

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Create Journal Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}