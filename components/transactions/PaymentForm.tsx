import { useState } from "react"
import { recipients } from "@/data/recipients"
import { BanknotesIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline"

export default function PaymentForm() {
  const [recipientId, setRecipientId] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payment = {
      recipientId,
      amount: Number(amount),
      date,
    }
    console.log("Payment saved:", payment)
    alert("Payment saved!")

    setRecipientId("")
    setAmount("")
    setDate(new Date().toISOString().split("T")[0])
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-6 border border-gray-200"
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Add New Payment</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Recipient</label>
        <div className="relative">
          <UserIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Select Recipient --</option>
            {recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
        <div className="relative">
          <BanknotesIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter amount"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <div className="relative">
          <CalendarIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Save Payment
        </button>
      </div>
    </form>
  )
}
