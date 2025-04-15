// import { useState } from "react"

// export default function AgentForm() {
//   const [name, setName] = useState("")
//   const [openingBalance, setOpeningBalance] = useState("")
//   const [address, setAddress] = useState("")
//   const [mobile, setMobile] = useState("")
//   const [email, setEmail] = useState("")
//   const [commPercent, setCommPercent] = useState("")

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     alert(`Agent Added:\n${name}, ₹${openingBalance}, ${address}, ${mobile}, ${email}, ${commPercent}%`)
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-5"
//     >
//       <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Add New Agent</h2>

//       {/* Grid layout for inputs */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agent Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={e => setName(e.target.value)}
//             className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opening Balance</label>
//           <input
//             type="number"
//             value={openingBalance}
//             onChange={e => setOpeningBalance(e.target.value)}
//             className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div className="sm:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
//           <textarea
//             value={address}
//             onChange={e => setAddress(e.target.value)}
//             className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows={2}
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile</label>
//           <input
//             type="tel"
//             value={mobile}
//             onChange={e => setMobile(e.target.value)}
//             className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Commission %</label>
//           <input
//             type="number"
//             step="0.01"
//             value={commPercent}
//             onChange={e => setCommPercent(e.target.value)}
//             className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//       </div>

//       <div className="pt-4">
//         <button
//           type="submit"
//           className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded shadow"
//         >
//           Save Agent
//         </button>
//       </div>
//     </form>
//   )
// }

// import { useState } from "react";
// import axios from "axios";

// export default function AgentForm() {
//   const [form, setForm] = useState({
//     name: "",
//     address: "",
//     mobile: "",
//     email: "",
//     commPercent: "",
//     openingBalance: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/api/agents", {
//         ...form,
//         commPercent: Number(form.commPercent),
//         openingBalance: Number(form.openingBalance),
//       });
//       alert("Agent saved!");
//       setForm({
//         name: "",
//         address: "",
//         mobile: "",
//         email: "",
//         commPercent: "",
//         openingBalance: "",
//       });
//     } catch (error) {
//       console.error(error);
//       alert("Failed to save agent.");
//     }
//   };

//   return (
//     // <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-5"
//     >
//       <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
//         Add New Agent
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label className="block font-medium">Name</label>
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-2 rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Address</label>
//           <input
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-2 rounded"
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Mobile</label>
//           <input
//             name="mobile"
//             value={form.mobile}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-2 rounded"
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-2 rounded"
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Commission %</label>
//           <input
//             type="number"
//             name="commPercent"
//             value={form.commPercent}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-2 rounded"
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Opening Balance</label>
//           <input
//             type="number"
//             name="openingBalance"
//             value={form.openingBalance}
//             onChange={handleChange}
//             className="w-full border border-gray-300 p-2 rounded"
//           />
//         </div>
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
//       >
//         Save Agent
//       </button>
//     </form>
//   );
// }


import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function AgentForm() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: "",
    address: "",
    mobile: "",
    email: "",
    commPercent: "",
    openingBalance: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/api/agents/${id}`)
        .then((res) => {
          const data = res.data;
          setForm({
            name: data.name || "",
            address: data.address || "",
            mobile: data.mobile || "",
            email: data.email || "",
            commPercent: data.commPercent?.toString() || "",
            openingBalance: data.openingBalance?.toString() || "",
          });
        })
        .catch((err) => {
          console.error("Failed to load agent:", err);
          alert("Failed to load agent data.");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        commPercent: Number(form.commPercent),
        openingBalance: Number(form.openingBalance),
      };

      if (id) {
        await axios.put(`/api/agents/${id}`, payload);
        alert("Agent updated!");
      } else {
        await axios.post("/api/agents", payload);
        alert("Agent created!");
        setForm({
          name: "",
          address: "",
          mobile: "",
          email: "",
          commPercent: "",
          openingBalance: "",
        });
      }

      router.push("/agents");
    } catch (error) {
      console.error("Error saving agent:", error);
      alert("Failed to save agent.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading form...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      // className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-5"
      className="max-w-2xl mx-auto bg-white  p-6 rounded-lg shadow space-y-5"
    >
      {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2"> */}
      <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
        {id ? "Edit Agent" : "Add New Agent"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Mobile</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Commission %</label>
          <input
            type="number"
            name="commPercent"
            value={form.commPercent}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Opening Balance</label>
          <input
            type="number"
            name="openingBalance"
            value={form.openingBalance}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        {id ? "Update Agent" : "Save Agent"}
      </button>
    </form>
  );
}
