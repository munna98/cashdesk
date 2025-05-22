import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  BanknotesIcon,
  CalendarIcon,
  UserCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

interface Agent {
  _id: string;
  name: string;
  commPercent?: number;
}

interface Account {
  _id: string;
  name: string;
  linkedEntityId: string;
  type: string;
}

interface AgentWithAccount extends Agent {
  account?: Account;
}

interface SavedReceiptInfo {
  transactionNumber: string;
  amount: number;
  commissionAmount?: number;
}

interface ReceiptFormProps {
  onReceiptSaved?: (receiptInfo: SavedReceiptInfo) => void;
}

export default function ReceiptForm({ onReceiptSaved }: ReceiptFormProps) {
  const [agents, setAgents] = useState<AgentWithAccount[]>([]);
  const [cashAccountId, setCashAccountId] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [type, setType] = useState("receipt");
  const [savedReceipt, setSavedReceipt] = useState<SavedReceiptInfo | null>(null);
  const [commissionAmount, setCommissionAmount] = useState<number | undefined>(undefined);

  // State to track if the commission amount input is currently focused
  const isCommissionAmountFocused = useRef(false);

  // Load agents, accounts, and link them together
  useEffect(() => {
    // Fetch agents
    const fetchData = async () => {
      try {
        // Get all agents
        const agentsRes = await axios.get("/api/agents");
        const agentsData = agentsRes.data;
        
        // Get all accounts
        const accountsRes = await axios.get("/api/accounts");
        const accountsData = accountsRes.data;
        
        // Link agents with their accounts
        const agentsWithAccounts = agentsData.map((agent: Agent) => {
          const agentAccount = accountsData.find(
            (account: Account) => 
              account.linkedEntityId?.toString() === agent._id?.toString()
          );
          
          return {
            ...agent,
            account: agentAccount || null
          };
        });
        
        setAgents(agentsWithAccounts);
        
        // Find cash account
        const cashAccount = accountsData.find((account: Account) => account.type === 'cash');
        if (cashAccount) {
          setCashAccountId(cashAccount._id);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    
    fetchData();
  }, []);

  // Update commission amount automatically when agent or amount changes
  useEffect(() => {
    const selectedAgent = agents.find((agent) => agent._id === selectedAgentId);
    if (selectedAgent && selectedAgent.commPercent && amount) {
      // Only update if the user hasn't manually changed it
      if (!isCommissionAmountFocused.current) {
        setCommissionAmount(Number(amount) * (selectedAgent.commPercent / 100));
      }
    } else {
      if (!isCommissionAmountFocused.current) {
        setCommissionAmount(undefined);
      }
    }
  }, [selectedAgentId, amount, agents]);

  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommissionAmount(Number(e.target.value));
  };
  
  const handleCommissionFocus = () => {
    isCommissionAmountFocused.current = true;
  };
  
  const handleCommissionBlur = () => {
    isCommissionAmountFocused.current = false;
  };

  // Submit receipt to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cashAccountId) {
      alert("Cash account not loaded yet. Please try again.");
      return;
    }

    // Find the selected agent and get their account ID
    const selectedAgent = agents.find(agent => agent._id === selectedAgentId);
    if (!selectedAgent || !selectedAgent.account) {
      alert("Agent has no linked account. Please set up the agent account first.");
      return;
    }

    const receipt = {
      fromAccount: selectedAgent.account._id, // Use the agent's account ID instead of agent ID
      toAccount: cashAccountId, // default cash account
      amount: Number(amount),
      date,
      note,
      type,
      commissionAmount: commissionAmount || 0, // Include commission in the transaction
    };

    try {
      const res = await axios.post("/api/transactions", receipt);
      console.log("Receipt saved:", res.data);

      const savedInfo: SavedReceiptInfo = {
        transactionNumber: res.data.transactionNumber,
        amount: res.data.amount,
        commissionAmount: res.data.commissionAmount,
      };
      setSavedReceipt(savedInfo);

      // Reset form
      setSelectedAgentId("");
      setAmount("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      setCommissionAmount(undefined);

      if (onReceiptSaved) onReceiptSaved(savedInfo);
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
            {savedReceipt.amount.toFixed(2)} has been recorded
            {savedReceipt.commissionAmount !== undefined && (
              <>
                {" "}(Commission: ₹{savedReceipt.commissionAmount.toFixed(2)})
              </>
            )}
            .
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

        {/* Agent Select */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Agent Account
          </label>
          <div className="relative">
            <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Select Agent Account --</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name} {!agent.account && "(No account linked)"}
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Commission Amount (Editable and Always Visible) */}
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            Save Receipt
          </button>
        </div>
      </form>
    </div>
  );
}