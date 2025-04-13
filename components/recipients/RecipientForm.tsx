import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/api/recipients/${id}`)
        .then((res) => {
          const data = res.data;
          setForm({
            name: data.name || "",
            address: data.address || "",
            mobile: data.mobile || "",
            email: data.email || "",
            openingBalance: data.openingBalance?.toString() || "",
          });
        })
        .catch((err) => {
          console.error("Failed to load recipient:", err);
          alert("Failed to load recipient data.");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        openingBalance: Number(form.openingBalance),
      };

      if (id) {
        await axios.put(`/api/recipients/${id}`, payload);
        alert("Recipient updated!");
      } else {
        await axios.post("/api/recipients", payload);
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
    } catch (error) {
      console.error("Error saving recipient:", error);
      alert("Failed to save recipient.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading form...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
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
      </div>

      <button
        type="submit"
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        {id ? "Update Recipient" : "Save Recipient"}
      </button>
    </form>
  );
}
