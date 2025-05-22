import { useState, useEffect } from "react";
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cashAccountId, setCashAccountId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [effectedAccountId, setEffectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [type, setType] = useState("payment");
  const [savedPayment, setSavedPayment] = useState<SavedPaymentInfo | null>(null);
  const [agents, setAgents] = useState<Account[]>([]);
  const [selectedToAccountType, setSelectedToAccountType] = useState("");

  // Fetch accounts and agents
  useEffect(() => {
    let fetchedCashAccountId = "";

    axios
      .get("/api/accounts?type=cash")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          fetchedCashAccountId = res.data[0]._id;
          setCashAccountId(fetchedCashAccountId);
        }
        return axios.get("/api/accounts");
      })
      .then((res) => {
        const allAccounts: Account[] = res.data;
        const filteredAccounts = allAccounts.filter(
          (acc) => acc._id !== fetchedCashAccountId
        );
        setAccounts(filteredAccounts);

        const agentAccounts = allAccounts.filter((acc) => acc.type === "agent");
        setAgents(agentAccounts);
      })
      .catch((err) => console.error("Failed to load accounts", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedToAccountType === "recipient" && !effectedAccountId) {
      alert("Please select a From Agent.");
      return;
    }

    const payment = {
      fromAccount: cashAccountId,
      toAccount: accountId,
      effectedAccount: selectedToAccountType === "recipient" ? effectedAccountId : "",
      amount: Number(amount),
      date,
      note,
      type,
    };

    try {
      const res = await axios.post("/api/transactions", payment);
      console.log("Payment saved:", res.data);

      setSavedPayment({
        transactionNumber: res.data.transactionNumber,
        amount: res.data.amount,
      });

      // Reset form
      setAccountId("");
      setEffectedAccountId("");
      setAmount("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      setSelectedToAccountType("");

      if (onPaymentSaved) onPaymentSaved();
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment.");
    }
  };

  // Update selected account type when accountId changes
  useEffect(() => {
    const selected = accounts.find((acc) => acc._id === accountId);
    setSelectedToAccountType(selected?.type || "");
  }, [accountId, accounts]);

  console.log(effectedAccountId,"effectedAccountId");
  

  return (
    <div className="max-w-xl mx-auto">
      {savedPayment && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">Payment saved successfully!</p>
          <p className="text-sm">
            Transaction #{savedPayment.transactionNumber} for ₹
            {savedPayment.amount.toFixed(2)} has been recorded.
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Select Agent --</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
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

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition"
          >
            Save Payment
          </button>
        </div>
      </form>
    </div>
  );
}
