// pages/transactions/receipts/[id]/edit.tsx
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BanknotesIcon,
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUpdateTransaction, QUERY_KEYS } from "@/hooks/queries/useAgents";

interface AgentAccount {
  _id: string;
  name: string;
}

interface Transaction {
  _id: string;
  creditAccount: {
    _id: string;
  };
  debitAccount: {
    _id: string;
  };
  amount: number;
  date: string;
  note?: string;
  type: string;
}

export default function EditReceiptPage() {
  const router = useRouter();
  const { id } = router.query;
  const transactionId = id as string;

  const [creditAccount, setCreditAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  // Fetch transaction details
  const { data: transaction, isLoading: isLoadingTransaction } = useQuery<Transaction>({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/transactions/${transactionId}`);
      return data;
    },
    enabled: !!transactionId,
  });

  // Fetch agent accounts
  const { data: agentAccounts = [], isLoading: isLoadingAgents } = useQuery<AgentAccount[]>({
    queryKey: [...QUERY_KEYS.accounts, { type: 'agent' }],
    queryFn: async () => {
      const { data } = await axios.get("/api/accounts?type=agent");
      return data;
    },
  });

  // Fetch cash account
  const { data: cashAccounts = [], isLoading: isLoadingCash } = useQuery<AgentAccount[]>({
    queryKey: [...QUERY_KEYS.accounts, { type: 'cash' }],
    queryFn: async () => {
      const { data } = await axios.get("/api/accounts?type=cash");
      return data;
    },
  });

  // Update mutation
  const updateTransaction = useUpdateTransaction();

  // Populate form when transaction data loads
  useEffect(() => {
    if (transaction) {
      setCreditAccount(transaction.creditAccount._id);
      setAmount(transaction.amount.toString());
      setDate(transaction.date.split("T")[0]);
      setNote(transaction.note || "");
    }
  }, [transaction]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cashAccounts[0]?._id) {
      alert("No cash account found.");
      return;
    }

    try {
      await updateTransaction.mutateAsync({
        id: transactionId,
        data: {
          debitAccount: cashAccounts[0]._id,  // Cash account (Dr)
          creditAccount: creditAccount,        // Agent account (Cr)
          amount: Number(amount),
          date,
          note,
          type: "receipt",
        },
      });
      router.push("/transactions/receipts/all");
    } catch (err) {
      console.error("Error updating receipt:", err);
      alert("Failed to update receipt.");
    }
  };

  const isLoading = isLoadingTransaction || isLoadingAgents || isLoadingCash;

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Edit Receipt</h1>

        {isLoading ? (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <p className="text-center text-gray-500">Loading...</p>
          </div>
        ) : !transaction ? (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <p className="text-center text-red-500">Receipt not found</p>
          </div>
        ) : !cashAccounts[0] ? (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <p className="text-center text-red-500">No cash account found. Please create a cash account first.</p>
          </div>
        ) : (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
          >
            {/* Agent Select */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Agent Account
              </label>
              <div className="relative">
                <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
                <select
                  value={creditAccount}
                  onChange={(e) => setCreditAccount(e.target.value)}
                  required
                  disabled={updateTransaction.isPending}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Select Agent Account --</option>
                  {agentAccounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
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
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={updateTransaction.isPending}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
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
                  required
                  disabled={updateTransaction.isPending}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  disabled={updateTransaction.isPending}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Error Message */}
            {updateTransaction.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Failed to update receipt. Please try again.
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={updateTransaction.isPending}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {updateTransaction.isPending ? "Updating..." : "Update Receipt"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}