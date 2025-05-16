import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type Recipient = {
  _id: string;
  name: string;
  address: string;
  mobile: string;
  email: string;
};

export default function RecipientList() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const res = await axios.get("/api/recipients");
        setRecipients(res.data);
      } catch (error) {
        console.error("Failed to fetch recipients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipients();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this recipient?")) {
      try {
        await axios.delete(`/api/recipients/${id}`);
        setRecipients((prev) => prev.filter((r) => r._id !== id));
      } catch (error) {
        console.error("Failed to delete recipient:", error);
        alert("Failed to delete recipient.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading recipients...</div>
    );
  }

  if (recipients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No recipients found. <Link href="/recipients/form" className="text-blue-500 hover:underline">Please add a recipient first</Link>.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipients.map((recipient) => (
        <div
          key={recipient._id}
          className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Card Header */}
          <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
            <h3 className="font-medium text-gray-900 truncate">
              {recipient.name}
            </h3>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => toggleMenu(recipient._id)}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1 cursor-pointer"
                title="Recipient actions"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>

              {activeMenu === recipient._id && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <Link
                      href={`/recipients/form?id=${recipient._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(recipient._id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4">
            {/* Address */}
            <div className="flex items-start space-x-2 text-sm text-gray-500 mb-3">
              <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2" title={recipient.address}>
                {recipient.address}
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <PhoneIcon className="h-4 w-4 flex-shrink-0" />
              <span>{recipient.mobile}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={recipient.email}>
                {recipient.email}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}