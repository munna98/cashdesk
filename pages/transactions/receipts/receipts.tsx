import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ReceiptForm from "@/components/transactions/ReceiptForm";
import RecentReceipts from "./recent-receipts";

export default function ReceiptEntryPage() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleReceiptSaved = () => {
    setRefreshCount((prev) => prev + 1); // trigger refresh
  };

  return (
    <Layout>
      <div className="p-2 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Receipt Entry</h1>

        {/* Responsive grid: 1 column on small screens, 2 on medium and up */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
          {/* Receipt Form */}
          <div>
            <ReceiptForm onReceiptSaved={handleReceiptSaved} />
          </div>

          {/* Recent Receipts */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Recent Receipts</h2>
            <RecentReceipts refreshTrigger={refreshCount} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
      