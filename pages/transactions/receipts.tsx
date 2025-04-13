import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ReceiptForm from "@/components/transactions/ReceiptForm";
import RecentReceipts from "./recentReceipts";

export default function ReceiptEntryPage() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleReceiptSaved = () => {
    setRefreshCount((prev) => prev + 1); // trigger refresh
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Receipt Entry</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Receipt Form */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Enter New Receipt</h2>
            <ReceiptForm onReceiptSaved={handleReceiptSaved} />
          </div>

          {/* Recent Receipts */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Recent Receipts</h2>
            <RecentReceipts refreshTrigger={refreshCount} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
