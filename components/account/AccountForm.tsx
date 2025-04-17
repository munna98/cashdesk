// /components/AccountForm.tsx
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AccountForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    type: "",
    balance: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        balance: Number(form.balance),
        linkedEntityType: null,
        linkedEntityId: null,
      };

      await axios.post("/api/accounts", payload);
      alert("Account created!");
      router.push("/accounts"); // Redirect to account list
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      // className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-5"
      className="max-w-xl mx-auto bg-white  p-4 rounded-lg shadow space-y-5"
    >
      {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white"> */}
      <h2 className="text-xl font-semibold text-gray-800 ">
        Add New Account
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
          <label className="block font-medium">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="other">Other</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Opening Balance</label>
          <input
            type="number"
            name="balance"
            value={form.balance}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Account"}
      </button>
    </form>
  );
}
