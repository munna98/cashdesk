// components/dashboard/AgentCard.tsx
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyRupeeIcon,
  CalculatorIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

interface AgentProps {
  id: string; // Add agent ID prop
  name: string;
  opening: number;
  received: number;
  paid: number;
  commission: number;
  onReceiveCash: (agentId: string, agentName: string) => void; // Callback for receive action
  onMakePayment: (agentId: string, agentName: string) => void; // Callback for payment action
}

export default function AgentCard({
  id,
  name,
  opening,
  received,
  paid,
  commission,
  onReceiveCash,
  onMakePayment,
}: AgentProps) {
  const closing = opening + received - paid - commission;

  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-300 w-full border border-gray-100 ">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <span className="inline-block w-2 h-6 bg-blue-500 rounded-sm mr-2"></span>
        {name}
      </h2>

      <div className="flex flex-col gap-2 text-sm">
        {/* Row 1: Opening */}
        <div className="flex w-full">
          <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-50 text-blue-700 flex-1">
            <BanknotesIcon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">
              Opening: ₹{opening.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Row 2: Tocken */}
        <div className="flex w-full">
          <div className="flex items-center space-x-2 p-2 rounded-md bg-green-50 text-green-700 flex-1">
            <ArrowTrendingUpIcon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">
              Tocken: ₹{received.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Row 3: Commission */}
        <div className="flex w-full">
          <div className="flex items-center space-x-2 p-2 rounded-md bg-yellow-50 text-yellow-700 flex-1">
            <CalculatorIcon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">
              Commission: ₹{commission.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Row 4: Deposit */}
        <div className="flex w-full">
          <div className="flex items-center space-x-2 p-2 rounded-md bg-red-50 text-red-700 flex-1">
            <ArrowTrendingDownIcon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Deposit: ₹{paid.toLocaleString()}</span>
          </div>
        </div>

        {/* Final Row: Closing Balance */}
        <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-100 font-medium text-gray-800 w-full">
          <CurrencyRupeeIcon className="h-5 w-5 flex-shrink-0" />
          <span>Closing: ₹{closing.toLocaleString()}</span>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onReceiveCash(id, name)}
            className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Get Token
          </button>

          <button
            onClick={() => onMakePayment(id, name)}
            className="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
          >
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            Make Deposit
          </button>
        </div>
      </div>
    </div>
  );
}