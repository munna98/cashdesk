// /components/EmployeeForm.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/employees/${id}`)
        .then((res) => {
          const data = res.data;
          setForm({
            name: data.name || "",
            address: data.address || "",
            mobile: data.mobile || "",
            email: data.email || "",
            role: data.role || "",
          });
        })
        .catch((err) => {
          console.error("Failed to load employee:", err);
          alert("Failed to load employee data.");
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
      if (id) {
        await axios.put(`/api/employees/${id}`, form);
        alert("Employee updated!");
      } else {
        await axios.post("/api/employees", form);
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
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading form...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      // className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-5"
      className="max-w-2xl mx-auto bg-white  p-4 rounded-lg shadow space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
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
          <label className="block font-medium">Role</label>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-green-800"
      >
        {id ? "Update Employee" : "Save Employee"}
      </button>
    </form>
  );
}
