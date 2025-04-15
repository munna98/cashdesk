import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyRupeeIcon,
  CalculatorIcon,
} from "@heroicons/react/24/outline"

interface AgentProps {
  name: string
  opening: number
  received: number
  paid: number
  commission: number
}

export default function AgentCard({
  name,
  opening,
  received,
  paid,
  commission,
}: AgentProps) {
  const closing = opening + received - paid - commission
  
  return (
    // <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-300 w-full h-full border border-gray-100 dark:border-gray-700">
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-300 w-full h-full border border-gray-100 ">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
        <span className="inline-block w-2 h-6 bg-blue-500 rounded-sm mr-2"></span>
        {name}
      </h2>
      
      <div className="flex flex-col gap-2 text-sm">
        {/* First row: Opening and Received */}
        <div className="flex gap-2 w-full">
          {/* <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex-1"> */}
          <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-50  text-blue-700  flex-1">
            <BanknotesIcon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Opening: ₹{opening.toLocaleString()}</span>
          </div>
          
          {/* <div className="flex items-center space-x-2 p-2 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex-1"> */}
          <div className="flex items-center space-x-2 p-2 rounded-md bg-green-50  text-green-700  flex-1">
            <ArrowTrendingUpIcon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Received: ₹{received.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Second row: Commission and Paid */}
        <div className="flex gap-2 w-full">
          {/* <div className="flex items-center space-x-2 p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 flex-1"> */}
          <div className="flex items-center space-x-2 p-2 rounded-md bg-yellow-50  text-yellow-700 flex-1">
            <CalculatorIcon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Commission: ₹{commission.toLocaleString()}</span>
          </div>
          
          {/* <div className="flex items-center space-x-2 p-2 rounded-md bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex-1"> */}
          <div className="flex items-center space-x-2 p-2 rounded-md bg-red-50  text-red-700  flex-1">
            <ArrowTrendingDownIcon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Paid: ₹{paid.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Third row: Closing Balance */}
        {/* <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700/60 font-medium text-gray-800 dark:text-white w-full"> */}
        <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-100  font-medium text-gray-800  w-full">
          <CurrencyRupeeIcon className="h-5 w-5 flex-shrink-0" />
          <span>Closing: ₹{closing.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}