// components/dashboard/AgentCard.tsx
import { useRef } from "react";
import {
  BookOpenIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  CurrencyRupeeIcon,
  CalculatorIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { shareAgentSummaryOnWhatsApp } from "@/utils/shareAgentSummaryOnWhatsApp";
interface AgentProps {
  id: string;
  name: string;
  opening: number;
  received: number;
  paid: number;
  commission: number;
  cancelled: number;
  onReceiveCash: (agentId: string, agentName: string) => void;
  onMakePayment: (agentId: string, agentName: string) => void;
  onCancel: (agentId: string, agentName: string) => void;
}

export default function AgentCard({
  id,
  name,
  opening,
  received,
  paid,
  commission,
  cancelled,
  onReceiveCash,
  onMakePayment,
  onCancel,
}: AgentProps) {
  const closing = opening + received - paid - commission + cancelled;

  const handleWhatsAppShare = () => {
    shareAgentSummaryOnWhatsApp({
      name,
      opening,
      received,
      paid,
      commission,
      cancelled,
      closing,
    });
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-300 w-full border border-gray-100 relative">
      {/* Share Icon - Top Right Corner */}
      <button
        onClick={handleWhatsAppShare}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-green-50 transition-colors group"
        title="Share on WhatsApp"
      >
        <ShareIcon className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
      </button>

      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center pr-10">
        <span className="inline-block w-2 h-6 bg-blue-500 rounded-sm mr-2"></span>
        {name}
      </h2>

      <div className="flex flex-col gap-2 text-sm">
        {/* Row 1: Opening */}
        <div className="flex w-full">
          <div className="flex items-center justify-between space-x-2 p-1.5 rounded-md bg-purple-50 text-purple-700 flex-1">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="h-5 w-5 flex-shrink-0" />
              <span>Opening Balance:</span>
            </div>
            <span className="truncate">
              ₹{opening.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Row 2: Token */}
        <div className="flex w-full">
          <div className="flex items-center justify-between space-x-2 p-1.5 rounded-md bg-green-50 text-green-700 flex-1">
            <div className="flex items-center space-x-2">
              <BanknotesIcon className="h-5 w-5 flex-shrink-0" />
              <span>Token:</span>
            </div>
            <span className="truncate">
              ₹{received.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Row 3: Commission */}
        <div className="flex w-full">
          <div className="flex items-center justify-between space-x-2 p-1.5 rounded-md bg-yellow-50 text-yellow-700 flex-1">
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-5 w-5 flex-shrink-0" />
              <span>Commission:</span>
            </div>
            <span className="truncate">
              ₹{commission.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Row 4: Deposit */}
        <div className="flex w-full">
          <div className="flex items-center justify-between space-x-2 p-1.5 rounded-md bg-red-50 text-red-700 flex-1">
            <div className="flex items-center space-x-2">
              <CurrencyRupeeIcon className="h-5 w-5 flex-shrink-0" />
              <span>Deposit:</span>
            </div>
            <span className="truncate">
              ₹{paid.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Row 5: Cancelled */}
        <div className="flex w-full">
          <div className="flex items-center justify-between space-x-2 p-1.5 rounded-md bg-orange-50 text-orange-700 flex-1">
            <div className="flex items-center space-x-2">
              <XCircleIcon className="h-5 w-5 flex-shrink-0" />
              <span>Cancelled:</span>
            </div>
            <span className="truncate">
              ₹{cancelled.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Final Row: Closing Balance */}
        <div className="flex w-full">
          <div className="flex items-center justify-between space-x-2 p-1.5 rounded-md bg-blue-50 text-blue-700 font-medium flex-1">
            <div className="flex items-center space-x-2">
              <CalculatorIcon className="h-5 w-5 flex-shrink-0" />
              <span>Closing Balance:</span>
            </div>
            <span className="truncate">
              ₹{closing.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-3 relative">
          {/* Main Action Buttons - Compact */}
          <div className="flex gap-2">
            <button
              onClick={() => onReceiveCash(id, name)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-3 rounded-lg transition-all text-sm shadow-md hover:shadow-lg"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Get Token
            </button>

            <button
              onClick={() => onMakePayment(id, name)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 px-3 rounded-lg transition-all text-sm shadow-md hover:shadow-lg"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              Make Deposit
            </button>
          </div>

          {/* Floating Cancel Button */}
          <button
            onClick={() => onCancel(id, name)}
            className="absolute -top-1 -right-1 flex items-center justify-center bg-white hover:bg-orange-50 text-orange-500 hover:text-orange-600 font-medium p-1.5 rounded-full transition-all text-xs border border-orange-200 shadow-md hover:shadow-lg"
            title="Cancel"
          >
            <XCircleIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}