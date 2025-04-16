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
  const [cashAccountId, setCashAccountId] = useState("");
  const [accountId, setAccountId] = useState(""); // toAccount
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("payment");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Get cash account first
        const cashRes = await axios.get("/api/accounts?type=cash");
        const cashId = cashRes.data?.[0]?._id || "";
        setCashAccountId(cashId);

        // Get transaction
        const txnRes = await axios.get(`/api/transactions/${id}`);
        const txn = txnRes.data;

        setAccountId(txn.toAccount?._id || ""); // this is the one we allow user to edit
        setAmount(txn.amount.toString());
        setDate(txn.date.split("T")[0]);
        setNote(txn.note || "");
        setType(txn.type || "payment");

        // Fetch all accounts and filter out cash
        const allAccounts = await axios.get("/api/accounts");
        const filtered = allAccounts.data.filter(
          (acc: Account) => acc._id !== cashId
        );
        setAccounts(filtered);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load payment");
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
        fromAccount: cashAccountId,
        toAccount: accountId,
        amount: Number(amount),
        date,
        note,
        type,
      });
      router.push("/transactions/payments/all");
    } catch (err) {
      console.error("Error updating payment:", err);
      alert("Failed to update payment.");
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
            {/* Account Select */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Account
              </label>
              <div className="relative">
                <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
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
