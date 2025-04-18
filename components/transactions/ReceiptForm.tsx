// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   BanknotesIcon,
//   CalendarIcon,
//   UserCircleIcon,
//   PencilSquareIcon,
// } from "@heroicons/react/24/outline";

// interface AgentAccount {
//   _id: string;
//   name: string;
//   linkedEntityId: string; // if you need to trace back to the actual agent
// }

// interface SavedReceiptInfo {
//   transactionNumber: string;
//   amount: number;
// }

// interface ReceiptFormProps {
//   onReceiptSaved?: () => void;
// }

// export default function ReceiptForm({ onReceiptSaved }: ReceiptFormProps) {
//   const [agentAccounts, setAgentAccounts] = useState<AgentAccount[]>([]);
//   const [accountId, setAccountId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [note, setNote] = useState("");
//   const [type, setType] = useState("receipt");
//   const [savedReceipt, setSavedReceipt] = useState<SavedReceiptInfo | null>(
//     null
//   );

//   // Load agents from backend
//   useEffect(() => {
//     axios
//       .get("/api/accounts?type=agent")
//       .then((res) => setAgentAccounts(res.data))
//       .catch((err) => console.error("Failed to load accounts", err));
//   }, []);

//   // Submit receipt to backend
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const receipt = {
//       accountId,
//       amount: Number(amount),
//       date,
//       note,
//       type,
//     };

//     try {
//       const res = await axios.post("/api/transactions", receipt);
//       console.log("Receipt saved:", res.data);

//       // Store the transaction number for display
//       setSavedReceipt({
//         transactionNumber: res.data.transactionNumber,
//         amount: res.data.amount,
//       });

//       // Reset form
//       setAccountId("");
//       setAmount("");
//       setNote("");
//       setDate(new Date().toISOString().split("T")[0]);

//       // trigger refresh
//       if (onReceiptSaved) onReceiptSaved();
//     } catch (error) {
//       console.error("Error saving receipt:", error);
//       alert("Failed to save receipt.");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto">
//       {/* Success message */}
//       {savedReceipt && (
//         <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
//           <p className="font-medium">Receipt saved successfully!</p>
//           <p className="text-sm">
//             Transaction #{savedReceipt.transactionNumber} for ₹
//             {savedReceipt.amount.toFixed(2)} has been recorded.
//           </p>
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
//       >
//         <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
//           Enter New Receipt
//         </h2>
//         {/* Agent Select */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Agent Account
//           </label>
//           <div className="relative">
//             <UserCircleIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
//             <select
//               value={accountId}
//               onChange={(e) => setAccountId(e.target.value)}
//               required
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             >
//               <option value="">-- Select Agent Account --</option>
//               {agentAccounts.map((acc) => (
//                 <option key={acc._id} value={acc._id}>
//                   {acc.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Amount */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Amount Received
//           </label>
//           <div className="relative">
//             <BanknotesIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               placeholder="Enter amount"
//             />
//           </div>
//         </div>

//         {/* Date */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Date
//           </label>
//           <div className="relative">
//             <CalendarIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Note */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Note
//           </label>
//           <div className="relative">
//             <PencilSquareIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
//             <input
//               type="text"
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder="Optional note"
//               className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="pt-4">
//           <button
//             type="submit"
//             className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition"
//           >
//             Save Receipt
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
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
  linkedEntityId: string;
}

interface SavedReceiptInfo {
  transactionNumber: string;
  amount: number;
}

interface ReceiptFormProps {
  onReceiptSaved?: () => void;
}

export default function ReceiptForm({ onReceiptSaved }: ReceiptFormProps) {
  const [agentAccounts, setAgentAccounts] = useState<AgentAccount[]>([]);
  const [cashAccountId, setCashAccountId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [type, setType] = useState("receipt");
  const [savedReceipt, setSavedReceipt] = useState<SavedReceiptInfo | null>(null);

  // Load agent and cash accounts
  useEffect(() => {
    // Fetch agent accounts
    axios
      .get("/api/accounts?type=agent")
      .then((res) => setAgentAccounts(res.data))
      .catch((err) => console.error("Failed to load agent accounts", err));

      // Fetch cash account
      axios
        .get("/api/accounts?type=cash")
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setCashAccountId(res.data[0]._id);
          }
        })
        .catch((err) => console.error("Failed to load cash account", err));
    }, []);

  // Submit receipt to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cashAccountId) {
      alert("Cash account not loaded yet. Please try again.");
      return;
    }

    const receipt = {
      fromAccount: accountId, // agent account
      toAccount: cashAccountId, // default cash account
      amount: Number(amount),
      date,
      note,
      type,
    };

    try {
      const res = await axios.post("/api/transactions", receipt);
      console.log("Receipt saved:", res.data);

      setSavedReceipt({
        transactionNumber: res.data.transactionNumber,
        amount: res.data.amount,
      });

      // Reset form
      setAccountId("");
      setAmount("");
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

        {/* Agent Select */}
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
