// import { useState } from "react"

// export default function AgentForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     openingBalance: "",
//     address: "",
//     mobile: "",
//     email: "",
//     commPercent: "2.5"
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("Form submitted:", formData)
//     alert(`Agent Added: ${formData.name}, Balance: ₹${formData.openingBalance}`)
//   }

//   return (
//     <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//         <h2 className="text-xl font-bold text-white">Agent Information</h2>
//         <p className="text-blue-100 text-sm">Enter the details to add a new agent</p>
//       </div>

//       <form onSubmit={handleSubmit} className="p-6 space-y-6">
//         {/* Agent Name */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               placeholder="Enter agent's full name"
//               required
//             />
//           </div>

//           {/* Commission Percentage */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Commission Percentage</label>
//             <div className="relative">
//               <input
//                 type="number"
//                 name="commPercent"
//                 value={formData.commPercent}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 placeholder="Enter commission percentage"
//                 step="0.1"
//                 min="0"
//                 max="10"
//                 required
//               />
//               <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                 <span className="text-gray-500">%</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
//             <input
//               type="tel"
//               name="mobile"
//               value={formData.mobile}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               placeholder="+91 98765 43210"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               placeholder="agent@example.com"
//               required
//             />
//           </div>
//         </div>

//         {/* Address */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             rows={2}
//             className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             placeholder="Enter complete address"
//             required
//           />
//         </div>

//         {/* Financial Information */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance (₹)</label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <span className="text-gray-500">₹</span>
//             </div>
//             <input
//               type="number"
//               name="openingBalance"
//               value={formData.openingBalance}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               placeholder="Enter opening balance"
//               min="0"
//               required
//             />
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
//           <button 
//             type="button" 
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//           >
//             Cancel
//           </button>
//           <button 
//             type="submit" 
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//           >
//             Save Agent
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

import { useState } from "react"

export default function AgentForm() {
  const [name, setName] = useState("")
  const [openingBalance, setOpeningBalance] = useState("")
  const [address, setAddress] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [commPercent, setCommPercent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Agent Added:\n${name}, ₹${openingBalance}, ${address}, ${mobile}, ${email}, ${commPercent}%`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Add New Agent</h2>

      {/* Grid layout for inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agent Name</label>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Commission %</label>
          <input
            type="number"
            step="0.01"
            value={commPercent}
            onChange={e => setCommPercent(e.target.value)}
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
          Save Agent
        </button>
      </div>
    </form>
  )
}
