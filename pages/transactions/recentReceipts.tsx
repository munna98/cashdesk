// import { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { ClockIcon } from "@heroicons/react/24/outline";

// type Receipt = {
//   _id: string;
//   amount: number;
//   date: string;
//   account: {
//     name: string;
//   };
// };

// export default function RecentReceipts() {
//   const [receipts, setReceipts] = useState<Receipt[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReceipts = async () => {
//       try {
//         const res = await axios.get("/api/transactions/recent-receipts");
//         setReceipts(res.data);
//       } catch (err) {
//         console.error("Failed to load recent receipts:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReceipts();
//   }, []);

//   if (loading) {
//     return <div className="text-gray-500 py-4">Loading receipts...</div>;
//   }

//   return (
//     <div>
//       <ul className="space-y-4">
//         {receipts.map((receipt) => (
//           <li
//             key={receipt._id}
//             className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition"
//           >
//             <div>
//               <div className="font-medium text-gray-800">{receipt.account.name}</div>
//               <div className="text-sm text-gray-500 flex items-center space-x-1">
//                 <ClockIcon className="h-4 w-4" />
//                 <span>{new Date(receipt.date).toLocaleDateString()}</span>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-green-600 font-semibold text-lg">
//                 ₹{receipt.amount.toLocaleString()}
//               </div>
//               <div className="text-xs text-gray-400">ID: {receipt._id.slice(-6)}</div>
//             </div>
//           </li>
//         ))}
//       </ul>

//       <div className="mt-4 text-right">
//         <Link
//           href="/transactions/all-receipts"
//           className="inline-block text-sm font-medium text-blue-600 hover:underline"
//         >
//           Show More →
//         </Link>
//       </div>
//     </div>
//   );
// }


// RecentReceipts.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ClockIcon } from "@heroicons/react/24/outline";

type Receipt = {
  _id: string;
  amount: number;
  date: string;
  account: {
    name: string;
  };
};

export default function RecentReceipts({ refreshTrigger }: { refreshTrigger: number }) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get("/api/transactions/recent-receipts");
        setReceipts(res.data);
      } catch (err) {
        console.error("Error fetching receipts:", err);
      }
    };

    fetchReceipts();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  return (
    <div>
      <ul className="space-y-4">
        {receipts.map((receipt) => (
          <li
            key={receipt._id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition"
          >
            <div>
              <div className="font-medium text-gray-800">{receipt.account.name}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{new Date(receipt.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-600 font-semibold text-lg">
                ₹{receipt.amount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">ID: {receipt._id.slice(-6)}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-right">
        <Link href="/transactions/all-receipts" className="text-sm text-blue-600 hover:underline">
          Show More →
        </Link>
      </div>
    </div>
  );
}
