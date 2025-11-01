// pages/transactions/journal/[id]/edit.tsx
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BanknotesIcon,
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface Account {
  _id: string;
  name: string;
  type: string;
}

export default function EditJournalEntryPage() {
  const router = useRouter();
  const { id } = router.query;

  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [debitAccount, setDebitAccount] = useState(""); // Updated: from fromAccount to debitAccount
  const [creditAccount, setCreditAccount] = useState(""); // Updated: from toAccount to creditAccount
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [txnRes, accountsRes] = await Promise.all([
          axios.get(`/api/transactions/${id}`),
          axios.get("/api/accounts"),
        ]);

        const txn = txnRes.data;
        setDebitAccount(txn.debitAccount._id); // Updated: from fromAccount to debitAccount
        setCreditAccount(txn.creditAccount._id); // Updated: from toAccount to creditAccount
        setAmount(txn.amount.toString());
        setDate(txn.date.split("T")[0]);
        setNote(txn.note || "");
        
        // Filter out cash account (optional)
        const filteredAccounts = accountsRes.data.filter(
          (acc: Account) => acc.type !== "cash"
        );
        setAllAccounts(filteredAccounts);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load journal entry");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (debitAccount === creditAccount) { // Updated: from fromAccount/toAccount to debitAccount/creditAccount
      alert("Debit and Credit accounts cannot be the same.");
      return;
    }

    try {
      await axios.put(`/api/transactions/${id}`, {
        debitAccount,    // Updated: from fromAccount to debitAccount
        creditAccount,   // Updated: from toAccount to creditAccount
        amount: Number(amount),
        date,
        note,
        type: "journalentry",
      });
      router.push("/transactions/journal/all");
    } catch (err) {
      console.error("Error updating journal entry:", err);
      alert("Failed to update journal entry.");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Edit Journal Entry</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
          >
            {/* Debit Account */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Debit Account
              </label>
              <div className="relative">
                <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
                <select
                  value={debitAccount} // Updated: from fromAccount to debitAccount
                  onChange={(e) => setDebitAccount(e.target.value)} // Updated: from setFromAccount to setDebitAccount
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Select Account --</option>
                  {allAccounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({acc.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="flex justify-center">
              <ArrowRightIcon className="h-6 w-6 text-gray-400" />
            </div>

            {/* Credit Account */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Credit Account
              </label>
              <div className="relative">
                <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
                <select
                  value={creditAccount} // Updated: from toAccount to creditAccount
                  onChange={(e) => setCreditAccount(e.target.value)} // Updated: from setToAccount to setCreditAccount
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Select Account --</option>
                  {allAccounts.map((acc) => (
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                Update Journal Entry
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}