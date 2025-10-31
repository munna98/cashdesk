
// pages/transactions/journal/recent-journal.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ClockIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

type JournalEntry = {
  _id: string;
  transactionNumber: string;
  amount: number;
  date: string;
  fromAccount: {
    name: string;
  };
  toAccount: {
    name: string;
  };
};

export default function RecentJournalEntries({ refreshTrigger }: { refreshTrigger: number }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get("/api/transactions?type=journalentry");
        // Get last 5 entries
        setEntries(res.data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching journal entries:", err);
      }
    };

    fetchEntries();
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
        {entries.map((entry) => (
          <li
            key={entry._id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium text-gray-800">{entry.fromAccount.name}</span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-800">{entry.toAccount.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{formatDate(entry.date)}</span>
              </div>
              <div className="text-right">
                <div className="text-blue-600 font-semibold text-lg">
                  ₹{entry.amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">#{entry.transactionNumber}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-right">
        <Link href="/transactions/journal/all" className="text-sm text-blue-600 hover:underline">
          Show More →
        </Link>
      </div>
    </div>
  );
}