// components/account/AccountForm.tsx - Refactored with React Query
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount, useCreateAccount, useUpdateAccount } from "@/hooks/queries/useAgents";

export default function AccountForm() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: "",
    type: "",
    balance: "",
  });

  // React Query hooks
  const { data: account, isLoading } = useAccount(id as string);
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();

  // Populate form when account data loads
  useEffect(() => {
    if (account) {
      setForm({
        name: account.name || "",
        type: account.type || "",
        balance: account.balance?.toString() || "",
      });
    }
  }, [account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      balance: Number(form.balance),
      linkedEntityType: null,
      linkedEntityId: null,
    };

    try {
      if (id) {
        await updateMutation.mutateAsync({ id: id as string, data: payload });
        alert("Account updated!");
      } else {
        await createMutation.mutateAsync(payload);
        alert("Account created!");
        setForm({
          name: "",
          type: "",
          balance: "",
        });
      }
      router.push("/accounts");
    } catch (error: any) {
      console.error("Error saving account:", error);
      alert(error.response?.data?.error || "Failed to save account.");
    }
  };

  if (id && isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading form...</div>;
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-4 rounded-lg shadow space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {id ? "Edit Account" : "Add New Account"}
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
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block font-medium">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting 
          ? (id ? "Updating..." : "Creating...") 
          : (id ? "Update Account" : "Save Account")
        }
      </button>
    </form>
  );
}