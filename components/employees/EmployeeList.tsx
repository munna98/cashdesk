// /components/EmployeeList.tsx

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

type Employee = {
  _id: string;
  name: string;
  address: string;
  mobile: string;
  email: string;
  role: string;
};

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/employees");
        setEmployees(res.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
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
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`/api/employees/${id}`);
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      } catch (error) {
        console.error("Failed to delete employee:", error);
        alert("Failed to delete employee.");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading employees...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((emp) => (
        <div
          key={emp._id}
          className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Card Header */}
          <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-b border-gray-200">
            <h3 className="font-medium text-gray-900 truncate">{emp.name}</h3>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => toggleMenu(emp._id)}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1 cursor-pointer"
                title="Employee actions"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>

              {activeMenu === emp._id && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <Link
                      href={`/employees/form?id=${emp._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(emp._id)}
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
              <span className="line-clamp-2" title={emp.address}>
                {emp.address}
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <PhoneIcon className="h-4 w-4 flex-shrink-0" />
              <span>{emp.mobile}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate" title={emp.email}>{emp.email}</span>
            </div>

            {/* Role */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 border-t pt-3">
              <BriefcaseIcon className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium text-gray-800">{emp.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
