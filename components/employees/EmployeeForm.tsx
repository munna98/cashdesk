// components/employees/EmployeeForm.tsx - Refactored with React Query
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useEmployee, useCreateEmployee, useUpdateEmployee } from "@/hooks/queries/useAgents";

export default function EmployeeForm() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: "",
    address: "",
    mobile: "",
    email: "",
    role: "",
  });

  // React Query hooks
  const { data: employee, isLoading } = useEmployee(id as string);
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  // Populate form when employee data loads
  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || "",
        address: employee.address || "",
        mobile: employee.mobile || "",
        email: employee.email || "",
        role: employee.role || "",
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (id) {
        await updateMutation.mutateAsync({ id: id as string, data: form });
        alert("Employee updated!");
      } else {
        await createMutation.mutateAsync(form);
        alert("Employee created!");
        setForm({
          name: "",
          address: "",
          mobile: "",
          email: "",
          role: "",
        });
      }
      router.push("/employees");
    } catch (error: any) {
      console.error("Error saving employee:", error);
      alert(error.response?.data?.error || "Failed to save employee.");
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
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {id ? "Edit Employee" : "Add New Employee"}
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
          <label className="block font-medium">Role</label>
          <input
            name="role"
            value={form.role}
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
          : (id ? "Update Employee" : "Save Employee")
        }
      </button>
    </form>
  );
}