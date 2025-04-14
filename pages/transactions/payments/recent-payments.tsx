// components/RecentPayments.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ClockIcon } from "@heroicons/react/24/outline";

type Payment = {
  _id: string;
  transactionNumber: string;
  amount: number;
  date: string;
  account: {
    name: string;
  };
};

export default function RecentPayments({ refreshTrigger }: { refreshTrigger: number }) {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("/api/transactions/payments");
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };

    fetchPayments();
  }, [refreshTrigger]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";

    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  }

  return (
    <div>
      <ul className="space-y-4">
        {payments.map((payment) => (
          <li
            key={payment._id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition"
          >
            <div>
              <div className="font-medium text-gray-800">{payment.account.name}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{formatDate(payment.date)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-red-600 font-semibold text-lg">
                ₹{payment.amount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">#{payment.transactionNumber}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-right">
        <Link href="/transactions/payments/all" className="text-sm text-blue-600 hover:underline">
          Show More →
        </Link>
      </div>
    </div>
  );
}
