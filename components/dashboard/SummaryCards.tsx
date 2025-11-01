// components/dashboard/SummaryCards.tsx - FIXED with Opening and Closing Balance
import {
    BanknotesIcon,
    ArrowTrendingUpIcon,
    CurrencyRupeeIcon,
    CalculatorIcon,
    ChartBarIcon
  } from "@heroicons/react/24/solid"
  
  interface Props {
    openingBalance: number
    totalReceived: number
    totalCommission: number
    totalPaid: number
  }
  
  export default function SummaryCards({ 
    openingBalance, 
    totalReceived, 
    totalCommission, 
    totalPaid 
  }: Props) {
    // Closing balance = Opening + Received - Commission - Paid
    const closingBalance = openingBalance + totalReceived - totalCommission - totalPaid
  
    const cards = [
      {
        title: "Opening Balance",
        value: openingBalance,
        icon: ChartBarIcon,
        color: "bg-purple-100 text-purple-800",
      },
      {
        title: "Total Received",
        value: totalReceived,
        icon: BanknotesIcon,
        color: "bg-green-100 text-green-800",
      },
      {
        title: "Commission",
        value: totalCommission,
        icon: ArrowTrendingUpIcon,
        color: "bg-yellow-100 text-yellow-800",
      },
      {
        title: "Total Paid",
        value: totalPaid,
        icon: CurrencyRupeeIcon,
        color: "bg-red-100 text-red-800",
      },
      {
        title: "Closing Balance",
        value: closingBalance,
        icon: CalculatorIcon,
        color: "bg-blue-100 text-blue-800",
      },
    ]
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{card.title}</div>
                <div className="text-lg font-semibold">₹{card.value.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }