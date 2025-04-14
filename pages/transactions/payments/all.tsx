// pages/transactions/payments/all.tsx

import Layout from "@/components/layout/Layout";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";

type Payment = {
  _id: string;
  transactionNumber: string;
  amount: number;
  date: string;
  note: string;
  account: {
    name: string;
  };
};

export default function AllPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("/api/transactions/payments?all=true");
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
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
    const confirm = window.confirm("Are you sure you want to delete this payment?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/transactions/${id}`);
      setPayments(payments.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete payment.");
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Payments</h1>
          <Link
            href="/transactions/payments/payments"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Payment Entry
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-500">Loading payments...</div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {payment.account?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.transactionNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.note}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-red-600">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative" ref={menuOpenId === payment._id ? menuRef : null}>
                        <button
                          onClick={() =>
                            setMenuOpenId(menuOpenId === payment._id ? null : payment._id)
                          }
                          className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                        >
                          <EllipsisHorizontalIcon className="h-5 w-5" />
                        </button>

                        {menuOpenId === payment._id && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  setMenuOpenId(null);
                                  router.push(`/transactions/payments/${payment._id}/edit`);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  setMenuOpenId(null);
                                  handleDelete(payment._id);
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

            {payments.length === 0 && (
              <div className="text-center py-12 text-gray-500">No payments found</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
