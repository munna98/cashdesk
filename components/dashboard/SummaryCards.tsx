// components/dashboard/SummaryCards.tsx - Modern Design with White Background
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  CurrencyRupeeIcon,
  CalculatorIcon,
  BookOpenIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid"

interface Props {
  openingBalance: number
  totalReceived: number
  totalCommission: number
  totalPaid: number
  totalCancelled: number
}

export default function SummaryCards({ 
  openingBalance, 
  totalReceived, 
  totalCommission, 
  totalPaid,
  totalCancelled 
}: Props) {
  const closingBalance = openingBalance + totalReceived - totalCommission - totalPaid + totalCancelled

  const cards = [
    {
      title: "Opening",
      value: openingBalance,
      icon: BookOpenIcon,
      colorClass: "text-purple-600",
      bgClass: "bg-purple-50",
      borderClass: "border-purple-200",
    },
    {
      title: "Token",
      value: totalReceived,
      icon: BanknotesIcon,
      colorClass: "text-green-600",
      bgClass: "bg-green-50",
      borderClass: "border-green-200",
    },
    {
      title: "Commission",
      value: totalCommission,
      icon: ArrowTrendingUpIcon,
      colorClass: "text-yellow-600",
      bgClass: "bg-yellow-50",
      borderClass: "border-yellow-200",
    },
    {
      title: "Deposited",
      value: totalPaid,
      icon: CurrencyRupeeIcon,
      colorClass: "text-red-600",
      bgClass: "bg-red-50",
      borderClass: "border-red-200",
    },
    {
      title: "Cancelled",
      value: totalCancelled,
      icon: XCircleIcon,
      colorClass: "text-orange-600",
      bgClass: "bg-orange-50",
      borderClass: "border-orange-200",
    },
    {
      title: "Closing",
      value: closingBalance,
      icon: CalculatorIcon,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      borderClass: "border-blue-200",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border ${card.borderClass}`}
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgClass}`}>
                <card.icon className={`h-7 w-7 ${card.colorClass}`} />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-gray-600 text-xs font-medium uppercase tracking-wide">
                {card.title}
              </div>
              <div className={`text-2xl font-bold ${card.colorClass}`}>
                ₹{card.value.toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Decorative accent line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.bgClass}`}></div>
        </div>
      ))}
    </div>
  )
}