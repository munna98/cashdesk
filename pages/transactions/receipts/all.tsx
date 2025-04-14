import Layout from "@/components/layout/Layout";
import { EllipsisHorizontalIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";

type Receipt = {
  _id: string;
  transactionNumber: string;
  amount: number;
  date: string;
  note: string;
  account: {
    name: string;
  };
};

export default function AllReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get("/api/transactions/receipts?all=true");
        setReceipts(res.data);
      } catch (err) {
        console.error("Error fetching receipts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
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
    const confirm = window.confirm("Are you sure you want to delete this receipt?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/transactions/${id}`);
      setReceipts(receipts.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete receipt.");
    }
  };

  return (
    <Layout>
      <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">All Receipts</h1>
          <Link
            href="/transactions/receipts/receipts"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Receipt Entry
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-500">Loading receipts...</div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {receipts.map((receipt) => (
                    <tr key={receipt._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                        {receipt.account?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {receipt.transactionNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(receipt.date)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {receipt.note}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                        ₹{receipt.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="relative" ref={menuOpenId === receipt._id ? menuRef : null}>
                          <button
                            onClick={() =>
                              setMenuOpenId(menuOpenId === receipt._id ? null : receipt._id)
                            }
                            className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                          >
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                          </button>
                          {menuOpenId === receipt._id && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    router.push(`/transactions/receipts/${receipt._id}/edit`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    handleDelete(receipt._id);
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
              {receipts.map((receipt) => (
                <div
                  key={receipt._id}
                  className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 truncate">
                      {receipt.account?.name || "Unknown"}
                    </h3>
                    <div className="relative" ref={menuOpenId === receipt._id ? menuRef : null}>
                      <button
                        onClick={() =>
                          setMenuOpenId(menuOpenId === receipt._id ? null : receipt._id)
                        }
                        className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                      {menuOpenId === receipt._id && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setMenuOpenId(null);
                                router.push(`/transactions/receipts/${receipt._id}/edit`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setMenuOpenId(null);
                                handleDelete(receipt._id);
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
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <BanknotesIcon className="h-5 w-5 text-gray-400" />
                      <span>Receipt No:</span>
                      <span className="font-medium text-gray-900">
                        {receipt.transactionNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Date:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(receipt.date)}
                      </span>
                    </div>
                    {receipt.note && (
                      <div className="text-sm text-gray-600">
                        <span>Note:</span>
                        <p className="font-medium text-gray-900 mt-1">{receipt.note}</p>
                      </div>
                    )}
                    <div className="pt-2 text-sm text-gray-600 border-t border-gray-100">
                      Amount:{" "}
                      <span className="font-semibold text-green-600">
                        ₹{receipt.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {receipts.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                No receipts found
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
