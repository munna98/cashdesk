// components/dashboard/MakePaymentModal.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BanknotesIcon,
  UserCircleIcon,
  CalendarIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

interface Account {
  _id: string;
  name: string;
  type: string;
  linkedEntityId: string;
}

interface Agent {
  _id: string;
  name: string;
}

interface AgentWithAccount extends Agent {
  account?: Account;
}

interface MakePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string | null;
  agentName: string | null;
  onPaymentMade: (paymentInfo: SavedPaymentInfo) => void;
}

interface SavedPaymentInfo {
  transactionNumber: string;
  amount: number;
}

const MakePaymentModal = ({
  isOpen,
  onClose,
  agentId,
  agentName,
  onPaymentMade,
}: MakePaymentModalProps) => {
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [agentWithAccount, setAgentWithAccount] = useState<AgentWithAccount | null>(null);
  const [cashAccount, setCashAccount] = useState<Account | null>(null);
  const [recipientAccounts, setRecipientAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch agent details, cash account, and recipient accounts when modal opens
  useEffect(() => {
    const fetchData = async () => {
      if (!agentId) {
        resetForm();
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Fetch agent details
        const agentResponse = await axios.get(`/api/agents/${agentId}`);
        const agent = agentResponse.data;

        // Fetch agent's account
        const agentAccountResponse = await axios.get(
          `/api/accounts?linkedEntityType=agent&linkedEntityId=${agentId}`
        );

        let agentAccount = null;
        if (agentAccountResponse.data && agentAccountResponse.data.length > 0) {
          agentAccount = agentAccountResponse.data[0];
        } else {
          console.error(`No account found for agent ID: ${agentId}`);
        }
        
        // Combine agent with its account
        setAgentWithAccount({
          ...agent,
          account: agentAccount
        });
        
        // Fetch cash account
        const cashAccountResponse = await axios.get("/api/accounts?type=cash");
        if (cashAccountResponse.data && cashAccountResponse.data.length > 0) {
          setCashAccount(cashAccountResponse.data[0]);
        } else {
          console.error("No cash account found!");
        }

        // Fetch all accounts and filter for recipients
        const allAccountsResponse = await axios.get("/api/accounts");
        const allAccounts = allAccountsResponse.data;
        
        // Filter for recipient accounts (exclude cash and agent accounts)
        const recipients = allAccounts.filter((acc: Account) => 
          acc.type === "recipient"
        );
        setRecipientAccounts(recipients);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
      
      // Reset form fields
      resetForm();
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, agentId]);

  const resetForm = () => {
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setNote("");
    setToAccountId("");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === "" ? "" : Number(value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const handleToAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToAccountId(e.target.value);
  };

  const handleSave = async () => {
    // Validation checks
    if (!agentId) {
      alert("Agent information is missing.");
      return;
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    
    if (!toAccountId) {
      alert("Please select a recipient account.");
      return;
    }
    
    if (!agentWithAccount?.account) {
      alert(`Error: No account found for agent ${agentName}.`);
      return;
    }
    
    if (!cashAccount) {
      alert("Error: Cash account not found.");
      return;
    }

    setIsLoading(true);
    
    try {
      const paymentData = {
        fromAccount: cashAccount._id,                    // Money is going FROM our cash account
        toAccount: toAccountId,                         // Money is going TO the recipient account
        effectedAccount: agentWithAccount.account._id,  // This payment affects the agent's account
        amount: amount,
        date: date,
        note: note,
        type: "payment",
      };

      const response = await axios.post("/api/transactions", paymentData);
      console.log("Payment created:", response.data);

      const savedInfo: SavedPaymentInfo = {
        transactionNumber: response.data.transactionNumber,
        amount: response.data.amount,
      };

      onPaymentMade(savedInfo);
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creating payment:", error);
      alert(`Failed to make payment: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
          Make New Payment
        </h2>

        {!agentWithAccount?.account && agentId && !isLoading && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            <p className="text-sm">Warning: No account found for this agent. Please set up an account first.</p>
          </div>
        )}

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
        >
          {/* From Agent (Read-only Input) */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              From Agent
            </label>
            <div className="relative">
              <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <input
                type="text"
                value={agentName || ""}
                readOnly
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* To Account (Recipient Selection) */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              To Account (Recipient)
            </label>
            <div className="relative">
              <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <select
                value={toAccountId}
                onChange={handleToAccountChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Select Recipient Account --</option>
                {recipientAccounts.map((acc) => (
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
              Amount to Pay
            </label>
            <div className="relative">
              <BanknotesIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
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
                onChange={handleDateChange}
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
                onChange={handleNoteChange}
                placeholder="Optional note"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || !cashAccount || !toAccountId}
              className={`w-auto ${
                !cashAccount || isLoading || !toAccountId
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              } text-white font-medium py-2 px-4 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {isLoading ? "Processing..." : "Make Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakePaymentModal;