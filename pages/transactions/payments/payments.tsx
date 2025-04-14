// pages/transactions/payments/payments.tsx

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PaymentForm from "@/components/transactions/PaymentForm";
import RecentPayments from "./recent-payments";

export default function PaymentEntryPage() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handlePaymentSaved = () => {
    setRefreshCount((prev) => prev + 1); // trigger recent list refresh
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Payment Entry</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Payment Form */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Enter New Payment</h2>
            <PaymentForm onPaymentSaved={handlePaymentSaved} />
          </div>

          {/* Recent Payments */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
            <RecentPayments refreshTrigger={refreshCount} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
