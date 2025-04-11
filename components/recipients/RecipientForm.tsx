
import { useState } from "react"

export default function RecipientForm() {
  const [name, setName] = useState("")
  const [openingBalance, setOpeningBalance] = useState("")
  const [address, setAddress] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Recipient Added:\n${name}, ₹${openingBalance}, ${address}, ${mobile}, ${email}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Add New Recipient</h2>

      {/* Grid layout for inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipient Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opening Balance</label>
          <input
            type="number"
            value={openingBalance}
            onChange={e => setOpeningBalance(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile</label>
          <input
            type="tel"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded shadow"
        >
          Save Recipient
        </button>
      </div>
    </form>
  )
}
