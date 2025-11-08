// pages/transactions/payments/[id]/edit.tsx - Fixed with effectedAccount
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BanknotesIcon,
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

interface Account {
  _id: string;
  name: string;
  type: string;
}

export default function EditPaymentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [agentAccounts, setAgentAccounts] = useState<Account[]>([]);
  const [cashAccountId, setCashAccountId] = useState("");
  const [debitAccountId, setDebitAccountId] = useState("");
  const [effectedAccountId, setEffectedAccountId] = useState(""); // Agent account for clearing
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Get cash account
        const cashRes = await axios.get("/api/accounts?type=cash");
        const cashId = cashRes.data?.[0]?._id || "";
        setCashAccountId(cashId);

        // Get transaction
        const txnRes = await axios.get(`/api/transactions/${id}`);
        const txn = txnRes.data;

        setDebitAccountId(txn.debitAccount?._id || "");
        setAmount(txn.amount.toString());
        setDate(txn.date.split("T")[0]);
        setNote(txn.note || "");
        setSelectedAccountType(txn.debitAccount?.type || "");

        // If it's a recipient payment, try to find the related journal to get effectedAccount
        if (txn.debitAccount?.type === "recipient" && txn.relatedTransactionId) {
          const relatedJournal = await axios.get(`/api/transactions/${txn.relatedTransactionId}`);
          setEffectedAccountId(relatedJournal.data.debitAccount._id); // Agent account from clearing journal
        }

        // Fetch all accounts (exclude cash)
        const allAccountsRes = await axios.get("/api/accounts");
        const filtered = allAccountsRes.data.filter(
          (acc: Account) => acc._id !== cashId
        );
        setAccounts(filtered);

        // Get agent accounts for the dropdown
        const agentsRes = await axios.get("/api/accounts?type=agent");
        setAgentAccounts(agentsRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load payment");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Update selected account type when debitAccountId changes
  useEffect(() => {
    const selected = accounts.find((acc) => acc._id === debitAccountId);
    setSelectedAccountType(selected?.type || "");
    
    // Reset effectedAccount if changing to non-recipient
    if (selected?.type !== "recipient") {
      setEffectedAccountId("");
    }
  }, [debitAccountId, accounts]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate recipient payment has effectedAccount
    if (selectedAccountType === "recipient" && !effectedAccountId) {
      alert("Please select a 'From Agent' for recipient payments.");
      return;
    }

    try {
      const payload: any = {
        debitAccount: debitAccountId,
        creditAccount: cashAccountId,
        amount: Number(amount),
        date,
        note,
        type: "payment",
      };

      // Only include effectedAccount if it's a recipient payment
      if (selectedAccountType === "recipient") {
        payload.effectedAccount = effectedAccountId;
      }

      await axios.put(`/api/transactions/${id}`, payload);
      router.push("/transactions/payments/all");
    } catch (err: any) {
      console.error("Error updating payment:", err);
      alert(err.response?.data?.error || "Failed to update payment.");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Edit Payment</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
          >
            {/* To Account (Recipient) */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                To Account (Recipient)
              </label>
              <div className="relative">
                <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
                <select
                  value={debitAccountId}
                  onChange={(e) => setDebitAccountId(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Select Account --</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* From Agent (only if To Account is a recipient) */}
            {selectedAccountType === "recipient" && (
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Select Agent --</option>
                    {agentAccounts.map((agent: Account) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will update the journal entry to clear the agent's account
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Update Payment
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}