// pages/transactions/journal/all.tsx - Updated with debit/credit
import Layout from "@/components/layout/Layout";
import { EllipsisHorizontalIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

type JournalEntry = {
  _id: string;
  transactionNumber: string;
  amount: number;
  date: string;
  note: string;
  debitAccount: {   // UPDATED: was fromAccount
    _id: string;
    name: string;
  };
  creditAccount: {  // UPDATED: was toAccount
    _id: string;
    name: string;
  };
};

export default function AllJournalEntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get("/api/transactions?type=journalentry");
        setEntries(res.data);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest('.menu-container')) {
        return;
      }
      setMenuOpenId(null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this journal entry?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/transactions/${id}`);
      setEntries(entries.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete journal entry.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto">
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-500">Loading journal entries...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">All Journal Entries</h1>
          <Link
            href="/transactions/journal"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Journal Entry
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit Account
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  →
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Account
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Journal No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                    {entry.debitAccount?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <ArrowRightIcon className="h-4 w-4 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                    {entry.creditAccount?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.transactionNumber}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.note || "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-semibold text-blue-600">
                    ₹{entry.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="relative menu-container">
                      <button
                        onClick={() =>
                          setMenuOpenId(menuOpenId === entry._id ? null : entry._id)
                        }
                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                      {menuOpenId === entry._id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/transactions/journal/${entry._id}/edit`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(entry._id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium text-gray-900">{entry.debitAccount?.name}</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{entry.creditAccount?.name}</span>
                </div>
                <div className="relative menu-container">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === entry._id ? null : entry._id)}
                    className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                  >
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                  </button>
                  {menuOpenId === entry._id && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/transactions/journal/${entry._id}/edit`);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(entry._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="text-sm text-gray-600">
                  Journal No: <span className="font-medium text-gray-900">{entry.transactionNumber}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Date: <span className="font-medium text-gray-900">{formatDate(entry.date)}</span>
                </div>
                {entry.note && (
                  <div className="text-sm text-gray-600">
                    Note: <span className="font-medium text-gray-900">{entry.note}</span>
                  </div>
                )}
                <div className="pt-2 text-sm text-gray-600 border-t border-gray-100">
                  Amount: <span className="font-semibold text-blue-600">₹{entry.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
            No journal entries found
          </div>
        )}
      </div>
    </Layout>
  );
}