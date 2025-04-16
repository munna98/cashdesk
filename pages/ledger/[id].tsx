import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

type Transaction = {
  _id: string;
  date: string;
  note: string;
  type: "receipt" | "payment";
  fromAccount: string;
  toAccount: string;
  amount: number;
};

export default function LedgerPage() {
  const router = useRouter();
  const { id } = router.query;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/accounts/${id}/ledger`)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error("Failed to fetch ledger", err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Account Ledger</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Note</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id} className="border-t">
                  <td className="px-4 py-2">
                    {dayjs(txn.date).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-2">{txn.note || "-"}</td>
                  <td className="px-4 py-2 capitalize">{txn.type}</td>
                  <td className="px-4 py-2 text-right">₹{txn.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
