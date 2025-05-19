import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  BanknotesIcon,
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon,
  CalculatorIcon,
} from "@heroicons/react/24/outline";

interface AgentAccount {
  _id: string;
  name: string;
  type: string;
  linkedEntityType: string;
  linkedEntityId: string;
  balance: number;
  commPercent?: number; // <-- Add commission percent
}

interface SavedReceiptInfo {
  transactionNumber: string;
  amount: number;
}

interface ReceiptFormProps {
  onReceiptSaved?: () => void;
}

export default function ReceiptForm({ onReceiptSaved }: ReceiptFormProps) {
  const router = useRouter();
  const { agentId } = router.query;

  const [agentAccounts, setAgentAccounts] = useState<AgentAccount[]>([]);
  const [cashAccountId, setCashAccountId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [commission, setCommission] = useState("0");
  const [selectedAgentCommission, setSelectedAgentCommission] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [type, setType] = useState("receipt");
  const [savedReceipt, setSavedReceipt] = useState<SavedReceiptInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Load agent and cash accounts
  useEffect(() => {
    setLoading(true);

    axios
      .get("/api/accounts?type=agent")
      .then((res) => {
        setAgentAccounts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load agent accounts", err);
        setLoading(false);
      });

    axios
      .get("/api/accounts?type=cash")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCashAccountId(res.data[0]._id);
        }
      })
      .catch((err) => console.error("Failed to load cash account", err));
  }, []);

  // Set pre-selected agent from query
  useEffect(() => {
    if (agentId && agentAccounts.length > 0 && !loading) {
      const matchingAccount = agentAccounts.find(
        (acc) => acc.linkedEntityId === agentId
      );
      if (matchingAccount) {
        setAccountId(matchingAccount._id);
        setSelectedAgentCommission(matchingAccount.commPercent || 0);
      }
    }
  }, [agentId, agentAccounts, loading]);

  // When agent selection changes
  useEffect(() => {
    const selected = agentAccounts.find((acc) => acc._id === accountId);
    if (selected) {
      setSelectedAgentCommission(selected.commPercent || 0);
      console.log(selected);
      console.log(selected._id);
      console.log(selected.name);
      console.log(selected.commPercent);
      
    } else {
      setSelectedAgentCommission(null);
    }
  }, [accountId, agentAccounts]);

  // Recalculate commission when amount or agent commission percent changes
  useEffect(() => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && selectedAgentCommission !== null) {
      const comm = (amt * selectedAgentCommission) / 100;
      setCommission(comm.toFixed(2));
    }
  }, [amount, selectedAgentCommission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cashAccountId) {
      alert("Cash account not loaded yet. Please try again.");
      return;
    }

    const receipt = {
      fromAccount: accountId,
      toAccount: cashAccountId,
      amount: Number(amount),
      commission: Number(commission),
      date,
      note,
      type,
    };

    try {
      const res = await axios.post("/api/transactions", receipt);
      console.log("Receipt saved:", res.data);

      setSavedReceipt({
        transactionNumber: res.data.transactionNumber || res.data._id,
        amount: res.data.amount,
      });

      setAccountId("");
      setAmount("");
      setCommission("0");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);

      if (onReceiptSaved) onReceiptSaved();
    } catch (error) {
      console.error("Error saving receipt:", error);
      alert("Failed to save receipt.");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {savedReceipt && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">Receipt saved successfully!</p>
          <p className="text-sm">
            Transaction #{savedReceipt.transactionNumber} for ₹
            {savedReceipt.amount.toFixed(2)} has been recorded.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
      >
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
          Enter New Receipt
        </h2>

        {loading ? (
          <div className="text-center py-4">Loading agent accounts...</div>
        ) : (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Agent Account
              </label>
              <div className="relative">
                <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Commission Amount
              </label>
              <div className="relative">
                <CalculatorIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
                <input
                  type="number"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Commission amount"
                />
              </div>
              {selectedAgentCommission !== null && (
                <p className="text-xs text-gray-500 mt-1">
                  Auto-calculated at {selectedAgentCommission}% of amount
                </p>
              )}
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
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Save Receipt
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
