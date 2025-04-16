// pages/transactions/receipts/[id]/edit.tsx
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

interface AgentAccount {
  _id: string;
  name: string;
}

export default function EditReceiptPage() {
  const router = useRouter();
  const { id } = router.query;

  const [agentAccounts, setAgentAccounts] = useState<AgentAccount[]>([]);
  const [fromAccount, setFromAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [cashAccountId, setCashAccountId] = useState(""); // Needed for update

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [txnRes, agentAccountsRes, cashAccountsRes] = await Promise.all([
          axios.get(`/api/transactions/${id}`),
          axios.get("/api/accounts?type=agent"),
          axios.get("/api/accounts?type=cash"),
        ]);

        const txn = txnRes.data;
        setFromAccount(txn.fromAccount._id);
        setAmount(txn.amount.toString());
        setDate(txn.date.split("T")[0]);
        setNote(txn.note || "");
        setAgentAccounts(agentAccountsRes.data);

        if (cashAccountsRes.data.length > 0) {
          setCashAccountId(cashAccountsRes.data[0]._id);
        } else {
          alert("No cash account found.");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`/api/transactions/${id}`, {
        fromAccount,
        toAccount: cashAccountId,
        amount: Number(amount),
        date,
        note,
        type: "receipt",
      });
      router.push("/transactions/receipts/all");
    } catch (err) {
      console.error("Error updating receipt:", err);
      alert("Failed to update receipt.");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Edit Receipt</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
          >
            {/* Agent Select */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Agent Account</label>
              <div className="relative">
                <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700">Amount Received</label>
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
              <label className="block text-sm font-medium text-gray-700">Date</label>
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
              <label className="block text-sm font-medium text-gray-700">Note</label>
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
                Update Receipt
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
