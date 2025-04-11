import Link from "next/link"
import { ClockIcon } from "@heroicons/react/24/outline"

const mockReceipts = [
  { id: "r1", agentName: "Salim", amount: 1000, date: "2025-04-10" },
  { id: "r2", agentName: "Naseer", amount: 750, date: "2025-04-09" },
  { id: "r3", agentName: "Muneer", amount: 1250, date: "2025-04-08" },
]

export default function RecentReceipts() {
  return (
    <div>
      <ul className="space-y-4">
        {mockReceipts.map(receipt => (
          <li
            key={receipt.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition"
          >
            <div>
              <div className="font-medium text-gray-800">{receipt.agentName}</div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{receipt.date}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-600 font-semibold text-lg">₹{receipt.amount.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Receipt ID: {receipt.id}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-right">
        <Link
          href="/transactions/all-receipts"
          className="inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Show More →
        </Link>
      </div>
    </div>
  )
}
