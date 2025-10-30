// components/recipients/RecipientForm.tsx - Refactored with React Query
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecipient, useCreateRecipient, useUpdateRecipient } from "@/hooks/queries/useAgents";

export default function RecipientForm() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: "",
    address: "",
    mobile: "",
    email: "",
    openingBalance: "",
  });

  // React Query hooks
  const { data: recipient, isLoading } = useRecipient(id as string);
  const createMutation = useCreateRecipient();
  const updateMutation = useUpdateRecipient();

  // Populate form when recipient data loads
  useEffect(() => {
    if (recipient) {
      setForm({
        name: recipient.name || "",
        address: recipient.address || "",
        mobile: recipient.mobile || "",
        email: recipient.email || "",
        openingBalance: recipient.openingBalance?.toString() || "",
      });
    }
  }, [recipient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      openingBalance: Number(form.openingBalance),
    };

    try {
      if (id) {
        await updateMutation.mutateAsync({ id: id as string, data: payload });
        alert("Recipient updated!");
      } else {
        await createMutation.mutateAsync(payload);
        alert("Recipient created!");
        setForm({
          name: "",
          address: "",
          mobile: "",
          email: "",
          openingBalance: "",
        });
      }
      router.push("/recipients");
    } catch (error: any) {
      console.error("Error saving recipient:", error);
      alert(error.response?.data?.error || "Failed to save recipient.");
    }
  };

  if (id && isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading form...</div>;
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {id ? "Edit Recipient" : "Add New Recipient"}
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
          <label className="block font-medium">Opening Balance</label>
          <input
            type="number"
            name="openingBalance"
            value={form.openingBalance}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block font-medium">Mobile</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            disabled={isSubmitting}
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
          : (id ? "Update Recipient" : "Save Recipient")
        }
      </button>
    </form>
  );
}