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
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Receipt Entry</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
          {/* Receipt Form */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Enter New Receipt</h2>
            <ReceiptForm onReceiptSaved={handleReceiptSaved} />
          </div>
          
          {/* Recent Receipts */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 mt-4 md:mt-0">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Recent Receipts</h2>
            <RecentReceipts refreshTrigger={refreshCount} />
          </div>
        </div>
      </div>
    </Layout>
  );
}