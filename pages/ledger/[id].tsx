import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

type Transaction = {
  _id: string;
  date: string;
  transactionNumber: string;
  note: string;
  type: "receipt" | "payment";
  fromAccount: {
    _id: string;
    name: string;
  };
  toAccount: {
    _id: string;
    name: string;
  };
  amount: number;
  balance: number;
  counterparty: string;
  debit: number;
  credit: number;
};

type LedgerData = {
  accountName: string;
  accountType: string;
  period: {
    startDate: string;
    endDate: string;
  };
  openingBalance: number;
  entries: Transaction[];
  closingBalance: number;
};

export default function LedgerPage() {
  const router = useRouter();
  const { id } = router.query;

  const [ledgerData, setLedgerData] = useState<LedgerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchLedger = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await axios.get(`/api/accounts/${id}/ledger?${params.toString()}`);
      setLedgerData(res.data);
    } catch (err) {
      console.error("Failed to fetch ledger", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [id]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLedger();
  };

  // ⭐ NEW UTILITY FUNCTION: Correctly determines the balance suffix and color
  const getBalanceDisplay = (balance: number, accountType: string) => {
    // These account types have a normal balance as Credit (negative number from API)
    const creditAccountTypes = ["liability", "income", "agent", "recipient"];
    const isCreditAccount = creditAccountTypes.includes(accountType);

    // Determine the suffix (API provides negative for 'Cr', positive for 'Dr')
    const suffix = balance >= 0 ? "Dr" : "Cr";

    // Determine if the balance is 'unusual' (i.e., not its normal sign)
    // - Asset/Expense: Dr balance (>= 0) is normal. Cr balance (< 0) is unusual (red).
    // - Liability/Income: Cr balance (< 0) is normal. Dr balance (>= 0) is unusual (red).
    const isUnusualBalance = (isCreditAccount && balance >= 0) || (!isCreditAccount && balance < 0);

    const colorClass = isUnusualBalance && balance !== 0 ? "text-red-600" : "text-gray-900";

    return {
      display: `₹${Math.abs(balance).toLocaleString()} ${suffix}`,
      colorClass,
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Account Ledger</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Back
        </button>
      </div>

      {ledgerData && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-medium mb-2">{ledgerData.accountName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Account Type</p>
              <p className="font-medium">{ledgerData.accountType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Opening Balance</p>
              {/* Apply getBalanceDisplay for Opening Balance */}
              <p className="font-medium">
                {getBalanceDisplay(ledgerData.openingBalance, ledgerData.accountType).display}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Closing Balance</p>
              {/* Apply getBalanceDisplay for Closing Balance with color */}
              <p
                className={`font-medium ${getBalanceDisplay(ledgerData.closingBalance, ledgerData.accountType).colorClass}`}
              >
                {getBalanceDisplay(ledgerData.closingBalance, ledgerData.accountType).display}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleFilter} className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="self-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading ledger data...</div>
      ) : ledgerData ? (
        <div className="border rounded-md overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Transaction No.</th>
                <th className="px-4 py-2">Particulars</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2 text-right">Debit</th>
                <th className="px-4 py-2 text-right">Credit</th>
                <th className="px-4 py-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledgerData.entries.map((txn) => {
                // Apply getBalanceDisplay for each transaction row
                const balanceDisplay = getBalanceDisplay(txn.balance, ledgerData.accountType);

                return (
                  <tr key={txn._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {dayjs(txn.date).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-4 py-2">{txn.transactionNumber}</td>
                    <td className="px-4 py-2">
                      <div>{txn.counterparty}</div>
                      <div className="text-xs text-gray-500">{txn.note || "-"}</div>
                    </td>
                    <td className="px-4 py-2 capitalize">{txn.type}</td>
                    <td className="px-4 py-2 text-right">
                      {txn.debit > 0 ? `₹${txn.debit.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {txn.credit > 0 ? `₹${txn.credit.toLocaleString()}` : "-"}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-medium ${balanceDisplay.colorClass}`}
                    >
                      {balanceDisplay.display}
                    </td>
                  </tr>
                );
              }
              )}
            </tbody>
            <tfoot className="bg-gray-50 font-medium">
              <tr>
                <td colSpan={4} className="px-4 py-2 text-right">
                  Total:
                </td>
                <td className="px-4 py-2 text-right">
                  ₹
                  {ledgerData.entries
                    .reduce((sum, txn) => sum + txn.debit, 0)
                    .toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  ₹
                  {ledgerData.entries
                    .reduce((sum, txn) => sum + txn.credit, 0)
                    .toLocaleString()}
                </td>
                {/* Apply getBalanceDisplay for Closing Balance in the footer */}
                <td
                  className={`px-4 py-2 text-right ${getBalanceDisplay(ledgerData.closingBalance, ledgerData.accountType).colorClass
                    }`}
                >
                  {getBalanceDisplay(ledgerData.closingBalance, ledgerData.accountType).display}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">No transactions found</div>
      )}
    </div>
  );
}