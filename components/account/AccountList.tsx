// components/account/AccountList.tsx - Refactored with React Query
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  EllipsisVerticalIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useAccounts, useDeleteAccount } from "@/hooks/queries/useAgents";

type Account = {
  _id: string;
  name: string;
  type: string;
  balance: number;
  linkedEntityId?: string | null;
};

const ACCOUNT_TYPES = ["all", "cash", "bank", "income", "expense"];

export default function AccountList() {
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Use React Query hooks
  const { data: accounts = [], isLoading, isError } = useAccounts();
  const deleteAccountMutation = useDeleteAccount();

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredAccounts(accounts);
    } else {
      setFilteredAccounts(accounts.filter((acc: Account) => acc.type === activeTab));
    }
  }, [accounts, activeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    try {
      await deleteAccountMutation.mutateAsync(id);
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      alert(error.response?.data?.error || "Failed to delete account.");
    }
  };

  const handleShowLedger = (accountId: string) => {
    router.push(`/ledger/${accountId}`);
  };

  const getTypeLabelStyle = (type: string) => {
    switch (type) {
      case "cash":
        return "bg-green-100 text-green-800";
      case "bank":
        return "bg-blue-100 text-blue-800";
      case "income":
        return "bg-yellow-100 text-yellow-800";
      case "expense":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading accounts...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading accounts. Please try again.
      </div>
    );
  }

  return (
    <div>
      {/* Top Filter Tabs */}
      <div className="mb-4 flex gap-3 overflow-x-auto scrollbar-hide">
        {ACCOUNT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-1 rounded-full text-sm sm:text-base border flex-shrink-0 ${
              activeTab === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((account) => (
          <div
            key={account._id}
            className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
              <h3 className="font-medium text-gray-900 truncate">{account.name}</h3>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => toggleMenu(account._id)}
                  className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                  title="Account actions"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>

                {activeMenu === account._id && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <Link
                        href={`/accounts/form?id=${account._id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </Link>
                      {/* Conditionally render the delete button */}
                      {account.linkedEntityId === null && (
                        <button
                          onClick={() => handleDelete(account._id)}
                          disabled={deleteAccountMutation.isPending}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BanknotesIcon className="h-5 w-5 text-gray-400" />
                <span>Type:</span>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTypeLabelStyle(
                    account.type
                  )}`}
                >
                  {account.type}
                </span>
              </div>

              <button
                onClick={() => handleShowLedger(account._id)}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                Show Ledger
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}