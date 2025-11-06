// pages/transactions/receipts/all.tsx - Updated with debit/credit
import Layout from "@/components/layout/Layout";
import { EllipsisHorizontalIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useReceipts, useDeleteTransaction } from "@/hooks/queries/useAgents";

type Receipt = {
  _id: string;
  transactionNumber: string;
  amount: number;
  commissionAmount?: number;
  date: string;
  note: string;
  debitAccount: {   // UPDATED: was fromAccount
    name: string;
  };
  creditAccount: {  // UPDATED: was toAccount
    name: string;
  };
};

export default function AllReceiptsPage() {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const router = useRouter();

  // Use React Query hooks
  const { data: receipts = [], isLoading } = useReceipts();
  const deleteTransactionMutation = useDeleteTransaction();
console.log(receipts[0]);

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

  const handleDelete = async (receipt: Receipt) => {
    const hasCommission = receipt.commissionAmount && receipt.commissionAmount > 0;
    
    let confirmMessage = `Are you sure you want to delete this receipt?\n\n`;
    confirmMessage += `Receipt: ${receipt.transactionNumber}\n`;
    confirmMessage += `Amount: ₹${receipt.amount.toLocaleString()}\n`;
    
    if (hasCommission) {
      confirmMessage += `\n⚠️ WARNING: This will also delete the related commission journal entry`;
    }
    
    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;

    try {
      await deleteTransactionMutation.mutateAsync(receipt._id);
      setMenuOpenId(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete receipt.");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto">
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-500">Loading receipts...</div>
          </div>
        </div>
      </Layout>
    );
  }

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

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-hidden bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent Account (Cr)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receipts.map((receipt: Receipt) => (
                <tr key={receipt._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                    {receipt.creditAccount?.name|| "Unknown"} 
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
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-yellow-600">
                    {receipt.commissionAmount ? `₹${receipt.commissionAmount.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="relative menu-container">
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
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/transactions/receipts/${receipt._id}/edit`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(receipt);
                              }}
                              disabled={deleteTransactionMutation.isPending}
                            >
                              {deleteTransactionMutation.isPending ? 'Deleting...' : 'Delete'}
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
          {receipts.map((receipt: Receipt) => (
            <div
              key={receipt._id}
              className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
                <h3 className="font-medium text-gray-900 truncate">
                  {receipt.creditAccount?.name || "Unknown"}
                </h3>
                <div className="relative menu-container">
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
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/transactions/receipts/${receipt._id}/edit`);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(receipt);
                          }}
                          disabled={deleteTransactionMutation.isPending}
                        >
                          {deleteTransactionMutation.isPending ? 'Deleting...' : 'Delete'}
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
                {receipt.commissionAmount && receipt.commissionAmount > 0 && (
                  <div className="text-sm text-gray-600">
                    Commission:{" "}
                    <span className="font-semibold text-yellow-600">
                      ₹{receipt.commissionAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {receipts.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
            No receipts found
          </div>
        )}
      </div>
    </Layout>
  );
}