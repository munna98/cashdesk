// import Layout from "@/components/layout/Layout";
// import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
// import Link from "next/link";
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";

// type Receipt = {
//   _id: string;
//   transactionNumber: string;
//   amount: number;
//   date: string;
//   account: {
//     name: string;
//   };
// };

// export default function AllReceiptsPage() {
//   const [receipts, setReceipts] = useState<Receipt[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchReceipts = async () => {
//       try {
//         const res = await axios.get("/api/transactions/receipts?all=true");
//         setReceipts(res.data);
//       } catch (err) {
//         console.error("Error fetching receipts:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReceipts();
//   }, []);

//   useEffect(() => {
//     // Close menu when clicking outside
//     function handleClickOutside(event: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setMenuOpenId(null);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [menuRef]);

//   function formatDate(dateString: string) {
//     const date = new Date(dateString);
//     return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
//       .toString()
//       .padStart(2, "0")}-${date.getFullYear()}`;
//   }

//   return (
//     <Layout>
//       <div className="p-6 max-w-6xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">All Receipts</h1>
//           <Link
//             href="/transactions/receipts"
//             className="text-sm text-blue-600 hover:underline"
//           >
//             ← Back to Receipt Entry
//           </Link>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="animate-pulse text-gray-500">Loading receipts...</div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Account
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Receipt No
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {receipts.map((receipt) => (
//                   <tr 
//                     key={receipt._id}
//                     className="hover:bg-gray-50 transition-colors duration-150"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="font-medium text-gray-900">{receipt.account?.name || "Unknown"}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{receipt.transactionNumber}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{formatDate(receipt.date)}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right">
//                       <div className="text-sm font-semibold text-green-600">₹{receipt.amount.toLocaleString()}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right">
//                       <div className="relative" ref={menuOpenId === receipt._id ? menuRef : null}>
//                         <button
//                           onClick={() => setMenuOpenId(menuOpenId === receipt._id ? null : receipt._id)}
//                           className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
//                         >
//                           <EllipsisHorizontalIcon className="h-5 w-5" />
//                         </button>
                        
//                         {menuOpenId === receipt._id && (
//                           <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//                             <div className="py-1">
//                               <button
//                                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                 onClick={() => {
//                                   setMenuOpenId(null);
//                                   // Handle edit action
//                                   console.log("Edit", receipt._id);
//                                 }}
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                                 onClick={() => {
//                                   setMenuOpenId(null);
//                                   // Handle delete action
//                                   console.log("Delete", receipt._id);
//                                 }}
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             {receipts.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 No receipts found
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }

import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

type Account = {
  _id: string;
  name: string;
};

type ReceiptFormData = {
  accountId: string;
  amount: number;
  date: string;
  note: string;
};

export default function EditReceiptPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState<ReceiptFormData>({
    accountId: "",
    amount: 0,
    date: "",
    note: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch accounts for the dropdown
    const fetchAccounts = async () => {
      try {
        const res = await axios.get("/api/accounts");
        setAccounts(res.data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Failed to load accounts");
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    // Fetch receipt data when ID is available
    const fetchReceipt = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const res = await axios.get(`/api/transactions/${id}`);
        const receiptData = res.data;
        
        // Format the date for the date input (YYYY-MM-DD)
        const formattedDate = new Date(receiptData.date)
          .toISOString()
          .split("T")[0];
        
        setFormData({
          accountId: receiptData.accountId,
          amount: receiptData.amount,
          date: formattedDate,
          note: receiptData.note || "",
        });
      } catch (err) {
        console.error("Error fetching receipt:", err);
        setError("Failed to load receipt details");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setSubmitting(true);
    setError("");
    
    try {
      await axios.put(`/api/transactions/${id}`, {
        ...formData,
        // Ensure we're passing the correct field names based on your API
        // The API expects agentId but our form uses accountId
        agentId: formData.accountId,
      });
      
      // Navigate back to the list page after successful update
      router.push("/transactions/receipts/all");
    } catch (err: any) {
      console.error("Error updating receipt:", err);
      setError(err.response?.data?.error || "Failed to update receipt");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 max-w-2xl mx-auto">
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-500">Loading receipt data...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Receipt</h1>
          <Link
            href="/transactions/receipts/all"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to All Receipts
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label htmlFor="accountId" className="block text-gray-700 text-sm font-bold mb-2">
              Account
            </label>
            <select
              id="accountId"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account._id} value={account._id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="note" className="block text-gray-700 text-sm font-bold mb-2">
              Note (Optional)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Receipt"}
            </button>
            <Link
              href="/transactions/receipts/all"
              className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}