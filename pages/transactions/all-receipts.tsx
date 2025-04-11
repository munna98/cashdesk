import Layout from "@/components/layout/Layout"
import { ClockIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

// Mock data — replace this later with actual fetched data
const allReceipts = [
  { id: "r1", agentName: "Salim", amount: 1000, date: "2025-04-10" },
  { id: "r2", agentName: "Naseer", amount: 750, date: "2025-04-09" },
  { id: "r3", agentName: "Muneer", amount: 1250, date: "2025-04-08" },
  { id: "r4", agentName: "Afsal", amount: 600, date: "2025-04-07" },
  { id: "r5", agentName: "Junaid", amount: 1100, date: "2025-04-06" },
  { id: "r6", agentName: "Sameer", amount: 920, date: "2025-04-05" },
  { id: "r7", agentName: "Yusuf", amount: 860, date: "2025-04-04" },
  { id: "r8", agentName: "Hameed", amount: 1400, date: "2025-04-03" },
]

export default function AllReceiptsPage() {
  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Receipts</h1>
          <Link
            href="/transactions/receipts"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Receipt Entry
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-semibold text-gray-800">{receipt.agentName}</h2>
                  <div className="text-sm text-gray-500 flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{receipt.date}</span>
                  </div>
                </div>
                <div className="text-green-600 font-semibold text-lg">
                  ₹{receipt.amount.toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-gray-400">Receipt ID: {receipt.id}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
