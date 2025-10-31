// components/agents/AgentForm.tsx - Refactored with React Query
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAgent, useCreateAgent, useUpdateAgent } from "@/hooks/queries/useAgents";

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

  // React Query hooks
  const { data: agent, isLoading } = useAgent(id as string);
  const createMutation = useCreateAgent();
  const updateMutation = useUpdateAgent();

  // Populate form when agent data loads
  useEffect(() => {
    if (agent) {
      setForm({
        name: agent.name || "",
        address: agent.address || "",
        mobile: agent.mobile || "",
        email: agent.email || "",
        commPercent: agent.commPercent?.toString() || "",
        openingBalance: agent.openingBalance?.toString() || "",
      });
    }
  }, [agent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      commPercent: Number(form.commPercent),
      openingBalance: Number(form.openingBalance),
    };

    try {
      if (id) {
        await updateMutation.mutateAsync({ id: id as string, data: payload });
        alert("Agent updated!");
      } else {
        await createMutation.mutateAsync(payload);
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
    } catch (error: any) {
      console.error("Error saving agent:", error);
      alert(error.response?.data?.error || "Failed to save agent.");
    }
  };

  if (id && isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading form...</div>;
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow space-y-5"
    >
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
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
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
        <div>
          <label className="block font-medium">Commission %</label>
          <input
            type="number"
            name="commPercent"
            value={form.commPercent}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
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
          : (id ? "Update Agent" : "Save Agent")
        }
      </button>
    </form>
  );
} 